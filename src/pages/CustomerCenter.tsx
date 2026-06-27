import { useMemo, useState } from 'react'
import { ArrowRight, MessageSquare, Phone, Sparkles, Users } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const leads = [
  { name: '张先生', source: '抖音', level: 'A', status: '待跟进', need: '想了解预算' },
  { name: '李女士', source: '小红书', level: 'A', status: '已联系', need: '需要案例' },
  { name: '王先生', source: '视频号', level: 'B', status: '待跟进', need: '比较价格' },
  { name: '陈女士', source: '微信', level: 'B', status: '跟进中', need: '等家人决策' },
]

function CustomerCenter() {
  const [level, setLevel] = useState('全部')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advice, setAdvice] = useState('')

  const visibleLeads = useMemo(() => leads.filter((lead) => level === '全部' || lead.level === level), [level])

  const generate = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setAdvice('')
    try {
      const content = await chatCompletion(
        [
          { role: 'system', content: '你是势能舱成交转化顾问。输出必须是可复制话术和下一步动作。' },
          {
            role: 'user',
            content: `
当前线索等级：${level}
补充背景：${context.trim() || '通过短视频和图文获得咨询，需要把线索推进到预约或成交。'}

请输出：
1. A/B/C线索判定标准
2. 首次私信回复3套
3. 电话回访脚本
4. 7天跟进节奏
5. 需要记录的10个事实字段
6. 最容易流失的风险点和处理话术
`.trim(),
          },
        ],
        { temperature: 0.55 }
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
          <p className="text-sm font-semibold text-primary">客户中心</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">把咨询变成可推进的事实</h1>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className={clsx('flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold', loading ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white')}
        >
          <Sparkles className="h-4 w-4" />
          {loading ? '生成中' : '生成跟进'}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: '总线索', value: '128', icon: Users },
          { label: 'A级线索', value: '23', icon: Phone },
          { label: '本周转化率', value: '23.5%', icon: MessageSquare },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <item.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex gap-2">
            {['全部', 'A', 'B', 'C'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={clsx('rounded-lg border px-4 py-2 text-sm font-semibold', level === item ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-700')}
              >
                {item === '全部' ? '全部' : `${item}级`}
              </button>
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {visibleLeads.map((lead) => (
              <div key={`${lead.name}-${lead.source}`} className="py-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-950">{lead.name}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">{lead.level}级</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{lead.source} / {lead.status} / {lead.need}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <label className="text-sm font-semibold text-gray-950">跟进背景</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="补充：产品、客单价、常见异议、成交方式、你希望下一步推进到哪里。"
            className="mt-3 h-44 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      {error ? <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {advice ? (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-950">跟进方案</h2>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">{advice}</div>
        </section>
      ) : null}
    </div>
  )
}

export default CustomerCenter
