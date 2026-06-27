import { useState } from 'react'
import { Sparkles, TrendingUp, Users, MessageSquare, ArrowRight, Play, Send } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const stats = [
  { label: '总粉丝', value: '125,680', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { label: '本月播放', value: '2.3M', change: '+28.3%', icon: Play, color: 'from-purple-500 to-pink-500' },
  { label: '获取线索', value: '128', change: '+15.8%', icon: MessageSquare, color: 'from-orange-500 to-red-500' },
  { label: '转化率', value: '23.5%', change: '+5.2%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
]

const recentContent = [
  { title: '2026年最新补贴政策解读', type: '干货科普', views: '45.2K', likes: '2.3K', date: '2小时前' },
  { title: '老旧小区加装电梯的5个坑', type: '避坑指南', views: '38.7K', likes: '1.9K', date: '5小时前' },
  { title: '王奶奶终于下楼晒太阳了', type: '情感共鸣', views: '89.5K', likes: '5.8K', date: '1天前' },
]

const quickActions = [
  { title: 'AI脚本生成', description: '一键生成爆款脚本', icon: Sparkles, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { title: '行业分析', description: '深度洞察市场机会', icon: TrendingUp, color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
  { title: 'IP定位', description: '打造独特人设', icon: Users, color: 'bg-gradient-to-br from-orange-500 to-red-500' },
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
              '你是AI+IP打造平台的全流程教练。输出要极度可执行：今天就能做，包含话术/选题/动作。',
          },
          {
            role: 'user',
            content: `
请根据我提供的情况，给出“今日3件事 + 7天行动计划”。
要求：每个动作都要有产出物（脚本/标题/私信话术/发布清单），并给出优先级。

我的补充信息：
${context.trim() || '（无）'}
`.trim(),
          },
        ],
        { temperature: 0.6 }
      )
      setPlan(content)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            欢迎回来，<span className="bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">IP建造者</span>
          </h1>
          <p className="text-gray-600">让我们继续打造你的个人IP影响力</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          快速开始
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">近期内容</h2>
            <button className="text-primary hover:text-accent-purple font-medium flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentContent.map((content, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{content.type}</span>
                    <span>👁 {content.views}</span>
                    <span>❤️ {content.likes}</span>
                    <span>{content.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">AI今日计划</h3>
              <button
                type="button"
                onClick={generatePlan}
                disabled={loading}
                className={clsx(
                  'px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
                  loading ? 'bg-white/10 text-white/60' : 'bg-white/20 hover:bg-white/30'
                )}
              >
                <Send className="w-4 h-4" />
                {loading ? '生成中…' : '生成'}
              </button>
            </div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="补充：行业/产品/客单价/你的人设角色/当前账号基础/你想优先涨粉或成交…"
              className="w-full h-24 resize-none rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {error ? <div className="mt-3 text-sm text-red-100">{error}</div> : null}
            {plan ? (
              <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-sm whitespace-pre-wrap leading-relaxed">
                {plan}
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">快捷操作</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md group"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">💡 今日建议</h3>
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              基于你的行业分析，建议今天发布一条关于"行业痛点解析"的内容，这类内容完播率最高，易于引发讨论。
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
