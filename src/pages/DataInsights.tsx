import { useState } from 'react'
import { TrendingUp, Eye, MessageSquare, ArrowUp, ArrowDown, Sparkles, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const metrics = [
  { label: '总播放量', value: '2.3M', change: '+28.3%', trend: 'up' },
  { label: '总粉丝', value: '125.6K', change: '+12.5%', trend: 'up' },
  { label: '互动率', value: '5.8%', change: '+0.8%', trend: 'up' },
  { label: '完播率', value: '42.3%', change: '-2.1%', trend: 'down' },
]

const topContent = [
  { title: '王奶奶终于下楼晒太阳了', views: '89.5K', likes: '5.8K', completion: '68%' },
  { title: '2026年最新补贴政策解读', views: '45.2K', likes: '2.3K', completion: '52%' },
  { title: '老旧小区加装电梯的5个坑', views: '38.7K', likes: '1.9K', completion: '48%' },
]

function DataInsights() {
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advice, setAdvice] = useState('')

  const generateAdvice = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setAdvice('')
    try {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              '你是势能舱平台的数据分析师。用数据做诊断并给出可执行动作。输出必须结构化。',
          },
          {
            role: 'user',
            content: `
核心指标：
${metrics.map((m) => `- ${m.label}: ${m.value} (${m.change})`).join('\n')}

TOP内容：
${topContent.map((c) => `- ${c.title} | views=${c.views} | likes=${c.likes} | completion=${c.completion}`).join('\n')}

补充信息：${context.trim() || '（无）'}

请输出：
1) 关键问题诊断（按优先级）
2) 可能原因假设（每个问题给3个原因）
3) 验证方法（怎么通过下一轮内容/数据验证）
4) 本周内容优化动作（至少10条，可直接执行）
5) 转化优化动作（私信引导、评论引导、资料包、加微路径）
6) 7天复盘表字段（用于每日填写）
`.trim(),
          },
        ],
        { temperature: 0.5 }
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
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">数据洞察</h1>
        <p className="text-gray-600">全链路数据追踪与效果分析</p>
      </div>

      <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI数据诊断
          </h2>
          <button
            type="button"
            onClick={generateAdvice}
            disabled={loading}
            className={clsx(
              'px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
              loading ? 'bg-white/10 text-white/60' : 'bg-white/20 hover:bg-white/30'
            )}
          >
            {loading ? '生成中…' : '生成建议'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="补充：你的目标（涨粉/完播/转化）、当前内容类型占比、你最想提升的指标…"
          className="w-full h-24 resize-none rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {error ? <div className="mt-3 text-sm text-red-100">{error}</div> : null}
        {advice ? (
          <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-sm whitespace-pre-wrap leading-relaxed">
            {advice}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">{metric.label}</p>
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-red-600" />
                )}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
            <p className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change} vs 上期
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">内容效果趋势</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">本周播放趋势</p>
                  <p className="text-sm text-gray-500">近7天数据</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">+28.3%</p>
            </div>

            <div className="h-48 bg-gradient-to-t from-primary/10 to-transparent rounded-xl flex items-end justify-around p-4">
              {[65, 78, 82, 75, 88, 92, 85].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 bg-gradient-to-t from-primary to-accent-purple rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {['一', '二', '三', '四', '五', '六', '日'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">转化漏斗</h2>
          <div className="space-y-4">
            <div className="relative">
              <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-between px-4">
                <span className="text-white font-medium">曝光</span>
                <span className="text-white font-bold">100,000</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">100%</p>
            </div>
            <div className="relative">
              <div className="h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-between px-4" style={{ width: '75%' }}>
                <span className="text-white font-medium">点击</span>
                <span className="text-white font-bold">75,000</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">75%</p>
            </div>
            <div className="relative">
              <div className="h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl flex items-center justify-between px-4" style={{ width: '45%' }}>
                <span className="text-white font-medium">咨询</span>
                <span className="text-white font-bold">45,000</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">45%</p>
            </div>
            <div className="relative">
              <div className="h-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl flex items-center justify-between px-4" style={{ width: '15%' }}>
                <span className="text-blue-800 font-medium text-sm">成交</span>
                <span className="text-blue-800 font-bold text-sm">15,000</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">15%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">爆款内容TOP榜</h2>
        <div className="space-y-4">
          {topContent.map((content, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-400 text-yellow-900' :
                index === 1 ? 'bg-gray-300 text-gray-700' :
                'bg-orange-300 text-orange-900'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {content.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> {content.likes}
                  </span>
                  <span>完播率: {content.completion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">💡 优化建议</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-medium mb-1">完播率偏低</p>
              <p className="text-white/80">建议优化前3秒内容，增加悬念</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="font-medium mb-1">互动率表现优秀</p>
              <p className="text-white/80">继续保持问答类内容</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">内容类型分布</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">干货科普</span>
                <span className="text-sm font-medium text-primary">50%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">情感共鸣</span>
                <span className="text-sm font-medium text-primary">30%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">IP人设</span>
                <span className="text-sm font-medium text-primary">20%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">平台对比</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">抖音</span>
              <span className="text-sm font-bold text-primary">播放 45%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">小红书</span>
              <span className="text-sm font-bold text-primary">播放 30%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">视频号</span>
              <span className="text-sm font-bold text-primary">播放 15%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">B站</span>
              <span className="text-sm font-bold text-primary">播放 10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataInsights
