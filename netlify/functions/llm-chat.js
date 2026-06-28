exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return empty(204)
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return json(500, { error: 'Missing DEEPSEEK_API_KEY in Netlify environment variables' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  if (!Array.isArray(payload.messages)) {
    return json(400, { error: 'messages must be an array' })
  }

  const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: typeof payload.model === 'string' ? payload.model : 'deepseek-chat',
      temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.7,
      max_tokens: typeof payload.max_tokens === 'number' ? payload.max_tokens : 1200,
      messages: payload.messages,
    }),
  })

  const text = await upstream.text()
  if (!upstream.ok) {
    return json(upstream.status, {
      error: parseUpstreamError(text, upstream.statusText),
      status: upstream.status,
    })
  }

  return {
    statusCode: upstream.status,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
    body: text,
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

function empty(statusCode) {
  return { statusCode, headers: corsHeaders(), body: '' }
}

function parseUpstreamError(text, fallback) {
  try {
    const body = JSON.parse(text)
    if (typeof body?.error === 'string') return body.error
    if (typeof body?.error?.message === 'string') return body.error.message
    if (typeof body?.message === 'string') return body.message
  } catch {}
  return fallback
}
