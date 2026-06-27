import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Flame,
  GitBranch,
  MessageSquare,
  Play,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const metrics = [
  { label: '内容到线索转化', value: '5.6%', change: '+18%', icon: GitBranch, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'A级线索', value: '23', change: '+8', icon: Users, tone: 'bg-orange-50 text-orange-700' },
  { label: '完播率缺口', value: '-2.1%', change: '优先修复', icon: Play, tone: 'bg-red-50 text-red-700' },
  { label: '本周内容产能', value: '14/21', change: '67%', icon: FileText, tone: 'bg-indigo-50 text-indigo-700' },
]

const flywheel = [
  { title: '定位', desc: '一句话钉住人群、问题和信任理由', icon: Target },
  { title: '内容', desc: '用痛点、证据和故事稳定制造触达', icon: Flame },
  { title: '线索', desc: '把评论、私信和资料包变成事实记录', icon: MessageSquare },
  { title: '复盘', desc: '用数据淘汰低效动作，放大有效模板', icon: BarChart3 },
]

const actionQueue = [
  { level: 'P0', title: '重写前3秒钩子', reason: '完播率下降会直接压制推荐，先修复流量入口。' },
  { level: 'P1', title: '给A级线索补一轮事实追问', reason: '成交不是靠热情，而是靠需求、预算、时间、决策链路。' },
  { level: 'P2', title: '把爆款内容拆成3个模板', reason: '模板化才能复用，复用才有产能和复利。' },
]

const competitorMap = [
  {
    name: 'Jasper',
    strength: '品牌声音、营销内容协同强',
    gap: '更偏通用营销团队，离本地成交链路较远',
    response: '势能舱把品牌语气下沉到“IP人设+私信转化”。',
  },
  {
    name: 'Copy.ai',
    strength: 'GTM工作流和自动化思路强',
    gap: '更偏B2B销售流程，内容人格资产较弱',
    response: '势能舱用IP内容带来信任，再进入线索运营。',
  },
  {
    name: 'HubSpot Breeze',
    strength: 'CRM数据和销售/内容智能体协同强',
    gap: '重CRM，前端内容破圈能力不是核心',
    response: '势能舱先解决“获客内容”，再承接CRM化管理。',
  },
  {
    name: 'Canva Magic Studio',
    strength: '视觉资产和内容生产效率强',
    gap: '强设计，弱经营诊断和成交闭环',
    response: '势能舱把内容生产放进增长飞轮，而不是只做素材。',
  },
]

const systemAudits = [
  '缺少品牌名，用户记不住产品本身',
  '模块存在，但首页没有解释下一步该做什么',
  '数据有展示，缺少经营判断和优先级',
  '内容生成强，线索跟进和复盘没有被首页放大',
]

function Dashboard() {
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState('')

  const generatePlan = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setPlan('')
    try {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              '你是势能舱的AI增长总监。必须从第一性原理出发，把IP增长拆成定位、内容、线索、复盘四个环节，只输出高杠杆动作。',
          },
          {
            role: 'user',
            content: `
请根据以下业务信息，输出“今日作战令 + 7天增长实验”。
要求：
1) 先判断真正约束
2) 每天只给3个动作
3) 每个动作必须有产出物
4) 包含内容脚本、私信话术、数据验证方式
5) 标明P0/P1/P2优先级

业务信息：
${context.trim() || '建筑工程/老楼加装电梯IP，目标是通过内容获客并转化线索。'}
`.trim(),
          },
        ],
        { temperature: 0.55 }
      )
      setPlan(content)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg bg-primary text-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90">
              <Sparkles className="h-4 w-4" />
              产品升级命名：势能舱
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight">
              AI IP增长作战台，把定位、内容、线索和复盘压缩成一条经营闭环。
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
              第一性原理：IP增长不是发更多内容，而是用更少动作持续制造信任、捕获需求、推进成交，并把有效打法沉淀成模板。
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['今天做什么', '为什么先做', '如何验证有效'].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/8 p-8 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold text-white/70">当前核心约束</p>
            <div className="mt-4 rounded-lg bg-white p-5 text-gray-900">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-red-50 p-2 text-red-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">流量不是瓶颈，转化路径才是瓶颈</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    近期内容已有播放和互动，但首页原来没有把“内容表现 - 线索分级 - 跟进动作”连起来，导致经营判断不够直接。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={clsx('rounded-lg p-2', metric.tone)}>
                <metric.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                {metric.change}
              </span>
            </div>
            <p className="mt-5 text-sm text-gray-500">{metric.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-950">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">AI今日作战令</h2>
              <p className="mt-1 text-sm text-gray-500">只生成能直接执行、能被数据验证的动作。</p>
            </div>
            <button
              type="button"
              onClick={generatePlan}
              disabled={loading}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
                loading ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white hover:bg-primary-light'
              )}
            >
              <Send className="h-4 w-4" />
              {loading ? '生成中' : '生成'}
            </button>
          </div>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="补充：行业、产品、客单价、当前账号数据、线索来源、成交方式、你最想突破的问题。"
            className="mt-5 h-28 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error ? <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
          {plan ? (
            <div className="mt-5 max-h-[420px] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-7 text-gray-800 whitespace-pre-wrap">
              {plan}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {actionQueue.map((action) => (
                <div key={action.title} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">{action.level}</span>
                    <p className="font-semibold text-gray-950">{action.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{action.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-950">增长飞轮</h2>
          <p className="mt-1 text-sm text-gray-500">把“做内容”升级为“可复利的经营系统”。</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {flywheel.map((item, index) => (
              <div key={item.title} className="rounded-lg border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/8 p-3 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-300">0{index + 1}</span>
                </div>
                <p className="mt-5 text-lg font-bold text-gray-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">竞品对标后的产品策略</h2>
            <p className="mt-1 text-sm text-gray-500">不做通用AI写作工具，做面向IP获客的增长闭环。</p>
          </div>
          <div className="hidden rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 md:block">
            差异化：内容人格 + 线索转化 + 数据复盘
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="py-3 pr-4 font-semibold">竞品</th>
                <th className="py-3 pr-4 font-semibold">优势</th>
                <th className="py-3 pr-4 font-semibold">空白</th>
                <th className="py-3 pr-4 font-semibold">势能舱升级方向</th>
              </tr>
            </thead>
            <tbody>
              {competitorMap.map((item) => (
                <tr key={item.name} className="border-b border-gray-100 text-sm">
                  <td className="py-4 pr-4 font-bold text-gray-950">{item.name}</td>
                  <td className="py-4 pr-4 text-gray-600">{item.strength}</td>
                  <td className="py-4 pr-4 text-gray-600">{item.gap}</td>
                  <td className="py-4 pr-4 text-primary font-medium">{item.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-950">已识别并修正的产品问题</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {systemAudits.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-primary p-6 text-white shadow-sm">
          <Rocket className="h-8 w-8 text-orange-300" />
          <h2 className="mt-5 text-2xl font-bold">下一步产品杠杆</h2>
          <p className="mt-3 text-sm leading-6 text-white/78">
            真正的长期壁垒不是多几个AI按钮，而是沉淀行业模板、爆款脚本库、线索评分模型和复盘数据库。
          </p>
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-primary">
            进入内容工厂
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
