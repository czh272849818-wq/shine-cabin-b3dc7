import { useState } from 'react'
import { Users, Phone, MessageSquare, TrendingUp, Search, ArrowRight, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const leads = [
  { id: 1, name: '张先生', phone: '138****1234', source: '抖音', level: 'A', status: '待跟进', time: '10分钟前' },
  { id: 2, name: '李女士', phone: '139****5678', source: '小红书', level: 'A', status: '已联系', time: '30分钟前' },
  { id: 3, name: '王先生', phone: '136****9012', source: '视频号', level: 'B', status: '待跟进', time: '1小时前' },
  { id: 4, name: '刘先生', phone: '137****3456', source: '抖音', level: 'C', status: '已归档', time: '2小时前' },
  { id: 5, name: '陈女士', phone: '135****7890', source: '微信', level: 'B', status: '跟进中', time: '3小时前' },
]

function CustomerCenter() {
  const [selectedLevel, setSelectedLevel] = useState('全部')
  const [leadContext, setLeadContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advice, setAdvice] = useState('')

  const generateFollowup = async () => {
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
              '你是AI+IP打造平台的线索运营与成交转化顾问。输出要可直接复制使用：话术、下一步动作、风险点。',
          },
          {
            role: 'user',
            content: `
当前筛选：${selectedLevel === '全部' ? '全部线索' : `${selectedLevel}级线索`}
补充信息：${leadContext.trim() || '（无）'}

请输出：
1) 线索分级判定规则（A/B/C，含触发条件）
2) 首次私信回复话术（3套：强利他/强专业/强情绪共鸣）
3) 电话回访脚本（开场-探需-给方案-推动下一步-收尾）
4) “事实跟踪”字段清单（至少10项，便于录入表格）
5) 7天跟进节奏（每天触达动作+目的）
6) 风险预警（用户流失/价格敏感/异议处理）
`.trim(),
          },
        ],
        { temperature: 0.6 }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">客户中心</h1>
          <p className="text-gray-600">智能线索管理与转化追踪</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent-purple text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Users className="w-5 h-5" />
          导入线索
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">总线索数</p>
            <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">128</p>
          <p className="text-sm text-green-600 mt-1">+12.5%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">A级线索</p>
            <span className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-sm text-green-600 mt-1">+8.3%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">B级线索</p>
            <span className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">45</p>
          <p className="text-sm text-green-600 mt-1">+15.2%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">转化率</p>
            <span className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">23.5%</p>
          <p className="text-sm text-green-600 mt-1">+5.2%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">线索池</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索线索..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>全部来源</option>
              <option>抖音</option>
              <option>小红书</option>
              <option>视频号</option>
              <option>微信</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {['全部', 'A', 'B', 'C'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level === '全部' ? '全部' : `${level}级`}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">姓名</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">联系方式</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">来源</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">级别</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{lead.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.level === 'A' ? 'bg-red-100 text-red-700' :
                      lead.level === 'B' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.level}级
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.status === '待跟进' ? 'bg-blue-100 text-blue-700' :
                      lead.status === '已联系' ? 'bg-green-100 text-green-700' :
                      lead.status === '跟进中' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-500">{lead.time}</p>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary hover:text-accent-purple font-medium flex items-center gap-1">
                      查看 <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI跟进与转化建议
          </h3>
          <button
            type="button"
            onClick={generateFollowup}
            disabled={loading}
            className={clsx(
              'px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
              loading ? 'bg-white/10 text-white/60' : 'bg-white/20 hover:bg-white/30'
            )}
          >
            {loading ? '生成中…' : '一键生成'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <textarea
          value={leadContext}
          onChange={(e) => setLeadContext(e.target.value)}
          placeholder="补充：行业/产品/客单价/成交方式/常见异议/你希望的跟进节奏…"
          className="w-full h-24 resize-none rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
        />

        {error ? <div className="mt-3 text-sm text-red-100">{error}</div> : null}
        {advice ? (
          <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-sm whitespace-pre-wrap leading-relaxed">
            {advice}
          </div>
        ) : null}
      </div>

      <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">💡 转化流程建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">1. 立即响应</p>
            <p className="text-white/80">A类线索1小时内必须电话回访</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">2. 价值输出</p>
            <p className="text-white/80">发送免费资料包，建立信任</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">3. 预约勘测</p>
            <p className="text-white/80">筛选高意向客户上门服务</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold mb-1">4. 持续跟进</p>
            <p className="text-white/80">定期维护，培育长期关系</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerCenter
