import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function llmProxyPlugin(apiKey: string | undefined): Plugin {
  let runtimeKey: string | undefined

  return {
    name: 'llm-proxy',
    configureServer(server) {
      const getApiKey = () => process.env.DEEPSEEK_API_KEY || apiKey || runtimeKey

      server.middlewares.use('/api/llm/health', (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        const key = getApiKey()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            hasKey: Boolean(key),
            hasProcessEnvKey: Boolean(process.env.DEEPSEEK_API_KEY),
            source: process.env.DEEPSEEK_API_KEY ? 'processEnv' : apiKey ? 'envFile' : runtimeKey ? 'runtime' : null,
          })
        )
      })

      server.middlewares.use('/api/llm/key', (req, res) => {
        if (req.method === 'DELETE') {
          runtimeKey = undefined
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
        req.on('end', () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as { apiKey?: unknown }
            if (typeof body.apiKey !== 'string' || body.apiKey.trim().length < 10) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid apiKey' }))
              return
            }
            runtimeKey = body.apiKey.trim()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Invalid JSON' }))
          }
        })
      })

      server.middlewares.use('/api/llm/chat', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        const key = getApiKey()
        if (!key) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing DEEPSEEK_API_KEY' }))
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
        req.on('end', async () => {
          try {
            const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
              },
              body: Buffer.concat(chunks),
            })

            const contentType = upstream.headers.get('content-type') ?? 'application/json'
            const text = await upstream.text()

            if (!upstream.ok) {
              let message = upstream.statusText
              try {
                const j = JSON.parse(text) as any
                if (typeof j?.error === 'string') message = j.error
                else if (typeof j?.error?.message === 'string') message = j.error.message
                else if (typeof j?.message === 'string') message = j.message
              } catch {}

              if (upstream.status === 401) {
                message = `Unauthorized：DeepSeek Key 无效/已过期/权限不足。请在右下角 AI助手里重新“临时配置 Key”，或用环境变量方式重启 dev server。`
              }

              res.statusCode = upstream.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: message, status: upstream.status }))
              return
            }

            res.statusCode = upstream.status
            res.setHeader('Content-Type', contentType)
            res.end(text)
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }))
          }
        })
        req.on('error', () => {
          next()
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)
  const apiKey = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY
  return {
    plugins: [react(), llmProxyPlugin(apiKey)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  }
})
