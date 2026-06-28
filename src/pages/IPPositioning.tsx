import { useState } from 'react'
import { ArrowRight, BadgeCheck, Sparkles, Target } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { streamCreatorAdvice } from '@/services/creator'
import { emptyWorkspace } from '@/services/workspace'
import { useWorkspace } from '@/hooks/useWorkspace'

const dimensions = [
  { label: '账号角色', value: '内容创作者 / 实拍博主 / 讲解型账号 / 带货型账号 / 多平台分发账号' },
  { label: '核心优势', value: '真实经历、专业知识、审美、表达' },
  { label: '可信证据', value: '现场、过程、数据、对比、结果' },
]

function IPPositioning() {
  const [brief, setBrief] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const { workspace, save } = useWorkspace()
  const currentWorkspace = workspace ?? emptyWorkspace()

  const generate = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      await streamCreatorAdvice(
        'script',
        `
账号说明：${brief.trim() || '自媒体工作者'}

请输出：
1. 一句话账号定位
2. 三个稳定人设方向
3. 三句自我介绍
4. 适合长期拍的内容支柱
5. 抖音、小红书、视频号、B站分别适合怎么表达
6. 不要做的内容
`.trim(),
        setResult
      )
      try {
        await save({
          ...currentWorkspace,
          workflow: {
            ...currentWorkspace.workflow,
            positioning: brief.trim(),
            updatedAt: new Date().toISOString(),
          },
        })
      } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">多平台脚本定位</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">先把自己说清楚，再开始稳定输出</h1>
          <p className="mt-2 text-sm text-gray-500">同一个人设要能在不同平台用不同方式说清楚。</p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className={clsx('flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold', loading ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white')}
        >
          <Sparkles className="h-4 w-4" />
          {loading ? '生成中' : '生成定位'}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <label className="text-sm font-semibold text-gray-950">账号说明</label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="输入你是谁、拍什么、给谁看、怎么变现、主要在哪些平台发。"
            className="mt-3 h-36 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
            <Target className="h-4 w-4 text-primary" />
            定位模型
          </div>
          <div className="mt-4 space-y-3">
            {dimensions.map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  <p className="font-semibold text-gray-950">{item.label}</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {result ? (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-950">定位方案</h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">{result}</div>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-950">下一步</h2>
            <p className="mt-1 text-sm text-gray-500">定位完成后，直接去发布台生成不同平台版本。</p>
          </div>
          <Link to="/content" className="flex items-center gap-2 text-sm font-semibold text-primary">
            去发布台
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default IPPositioning
