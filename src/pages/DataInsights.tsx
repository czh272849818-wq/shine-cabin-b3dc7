import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, BarChart3, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const metrics = [
  { label: '播放', value: '2.3M', change: '+28.3%', up: true },
  { label: '粉丝', value: '125.6K', change: '+12.5%', up: true },
  { label: '互动', value: '5.8%', change: '+0.8%', up: true },
  { label: '完播', value: '42.3%', change: '-2.1%', up: false },
]

const topContent = [
  { title: '王奶奶终于下楼晒太阳了', signal: '故事强，完播高', completion: '68%' },
  { title: '2026年最新补贴政策解读', signal: '政策强，收藏高', completion: '52%' },
  { title: '老旧小区加装电梯的5个坑', signal: '避坑强，转化高', completion: '48%' },
]

function DataInsights() {
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advice, setAdvice] = useState('')

  const generate = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setAdvice('')
    try {
      const content = await chatCompletion(
        [
          { role: 'system', content: '你是势能舱数据增长顾问。用数据找约束，只输出可验证动作。' },
          {
            role: 'user',
            content: `
核心指标：
${metrics.map((item) => `- ${item.label}: ${item.value} (${item.change})`).join('\n')}

TOP内容：
${topContent.map((item) => `- ${item.title} / ${item.signal} / 完播${item.completion}`).join('\n')}

补充背景：${context.trim() || '目标是提升内容到线索的转化。'}

请输出：
1. 本周真正问题是什么
2. 最该优化的一个指标
3. 3个原因假设
4. 7天验证实验
5. 下一批内容选题
6. 私信和资料包转化优化
`.trim(),
          },
        ],
        { temperature: 0.45 }
      )
      setAdvice(content)
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
          <p className="text-sm font-semibold text-primary">数据洞察</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">只看能改变动作的数据</h1>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className={clsx('flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold', loading ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white')}
        >
          <Sparkles className="h-4 w-4" />
          {loading ? '诊断中' : '生成诊断'}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{item.label}</p>
              {item.up ? <ArrowUp className="h-4 w-4 text-emerald-600" /> : <ArrowDown className="h-4 w-4 text-red-600" />}
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-950">{item.value}</p>
            <p className={clsx('mt-1 text-sm font-semibold', item.up ? 'text-emerald-600' : 'text-red-600')}>{item.change}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-950">
            <BarChart3 className="h-4 w-4 text-primary" />
            内容信号
          </div>
          <div className="divide-y divide-gray-100">
            {topContent.map((item) => (
              <div key={item.title} className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-gray-950">{item.title}</p>
                  <span className="text-sm font-bold text-primary">{item.completion}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.signal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <label className="text-sm font-semibold text-gray-950">补充数据</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="输入本周发布数量、线索数、成交数、最想提升的指标。"
            className="mt-3 h-44 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      {error ? <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {advice ? (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-950">诊断结果</h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">{advice}</div>
        </section>
      ) : null}
    </div>
  )
}

export default DataInsights
