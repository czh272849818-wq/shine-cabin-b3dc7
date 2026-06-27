export type LlmRole = 'system' | 'user' | 'assistant'

export type LlmMessage = {
  role: LlmRole
  content: string
}

export type ChatCompletionOptions = {
  model?: string
  temperature?: number
  max_tokens?: number
}

export async function chatCompletion(
  messages: LlmMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  const res = await fetch('/api/llm/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model ?? 'deepseek-chat',
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1200,
      messages,
    }),
  })

  const json = (await res.json().catch(() => null)) as any
  if (!res.ok) {
    const msg =
      typeof json?.error === 'string'
        ? json.error
        : typeof json?.error?.message === 'string'
          ? json.error.message
          : typeof json?.message === 'string'
            ? json.message
            : res.statusText
    throw new Error(msg)
  }

  const content = json?.choices?.[0]?.message?.content
  if (typeof content !== 'string') return ''
  return content
}
