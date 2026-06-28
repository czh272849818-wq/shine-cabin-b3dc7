const { randomUUID } = require('crypto')
const { connectLambda, getStore } = require('@netlify/blobs')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return empty(204)
  if (!['GET', 'PUT'].includes(event.httpMethod)) return json(405, { error: 'Method Not Allowed' })

  connectLambda(event)
  const store = getStore('shine-cabin')
  const session = await readSession(store, event.headers.authorization || event.headers.Authorization)
  if (!session) return json(401, { error: '请先登录' })

  const key = `workspaces/${session.userId}`

  if (event.httpMethod === 'GET') {
    const saved = await store.get(key, { type: 'json' })
    return json(200, saved || createEmptyWorkspace())
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  const workspace = sanitizeWorkspace(body)
  workspace.updatedAt = new Date().toISOString()
  await store.setJSON(key, workspace)
  return json(200, workspace)
}

async function readSession(store, authorization) {
  const token = typeof authorization === 'string' && authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : ''
  if (!token) return null
  const session = await store.get(`sessions/${token}`, { type: 'json' })
  if (!session || !session.expiresAt || new Date(session.expiresAt).getTime() < Date.now()) return null
  return session
}

function createEmptyWorkspace() {
  const now = new Date().toISOString()
  return {
    leads: [],
    metrics: {
      plays: 0,
      followers: 0,
      engagementRate: 0,
      completionRate: 0,
      conversions: 0,
      deals: 0,
    },
    contents: [],
    createdAt: now,
    updatedAt: now,
  }
}

function sanitizeWorkspace(body) {
  const empty = createEmptyWorkspace()
  return {
    ...empty,
    ...body,
    leads: Array.isArray(body.leads) ? body.leads.map(sanitizeLead).filter(Boolean) : [],
    metrics: sanitizeMetrics(body.metrics),
    contents: Array.isArray(body.contents) ? body.contents.map(sanitizeContent).filter(Boolean) : [],
  }
}

function sanitizeLead(item) {
  if (!item || typeof item !== 'object') return null
  return {
    id: stringValue(item.id) || cryptoId(),
    name: stringValue(item.name),
    source: stringValue(item.source),
    level: ['A', 'B', 'C'].includes(item.level) ? item.level : 'C',
    status: stringValue(item.status) || '待跟进',
    need: stringValue(item.need),
    createdAt: stringValue(item.createdAt) || new Date().toISOString(),
  }
}

function sanitizeMetrics(metrics = {}) {
  return {
    plays: numberValue(metrics.plays),
    followers: numberValue(metrics.followers),
    engagementRate: numberValue(metrics.engagementRate),
    completionRate: numberValue(metrics.completionRate),
    conversions: numberValue(metrics.conversions),
    deals: numberValue(metrics.deals),
  }
}

function sanitizeContent(item) {
  if (!item || typeof item !== 'object') return null
  return {
    id: stringValue(item.id) || cryptoId(),
    title: stringValue(item.title),
    signal: stringValue(item.signal),
    completionRate: numberValue(item.completionRate),
    createdAt: stringValue(item.createdAt) || new Date().toISOString(),
  }
}

function stringValue(value) {
  return typeof value === 'string' ? value.slice(0, 500).trim() : ''
}

function numberValue(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function cryptoId() {
  return randomUUID()
}

function empty(statusCode) {
  return { statusCode, headers: corsHeaders(), body: '' }
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

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  }
}
