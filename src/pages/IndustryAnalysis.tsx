import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Target, FileText, Sparkles, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const industries = [
  { name: '建筑工程', count: 128 },
  { name: '教育培训', count: 95 },
  { name: '医疗健康', count: 87 },
  { name: '金融服务', count: 76 },
  { name: '餐饮美食', count: 65 },
  { name: '房地产', count: 54 },
]

const painPoints = [
  { title: '信息不对称', description: '用户对行业了解不足，难以做出正确决策', priority: '高' },
  { title: '信任缺失', description: '市场上骗子太多，用户不敢轻易相信', priority: '高' },
  { title: '价格不透明', description: '用户担心被宰，不知道合理价格区间', priority: '中' },
  { title: '售后担忧', description: '担心付钱后服务跟不上', priority: '中' },
]

function IndustryAnalysis() {
  const [selectedIndustry, setSelectedIndustry] = useState('建筑工程')
  const [product, setProduct] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [region, setRegion] = useState('')
  const [targetCustomer, setTargetCustomer] = useState('')
  const [ipRole, setIpRole] = useState('')
  const [accountBase, setAccountBase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState('')

  const generateReport = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setReport('')
    try {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              '你是势能舱平台的行业分析专家。输出必须结构化、可执行、可复制。不要空话。',
          },
          {
            role: 'user',
            content: `
行业：${selectedIndustry}
补充信息：
- 产品/服务：${product.trim() || '（无）'}
- 客单价/价格带：${unitPrice.trim() || '（无）'}
- 地区/城市：${region.trim() || '（无）'}
- 目标客户：${targetCustomer.trim() || '（无）'}
- IP角色：${ipRole.trim() || '（无）'}
- 账号基础：${accountBase.trim() || '（无）'}

请输出一份“行业分析报告”，包含：
1) 行业现状与趋势（3-5点）
2) 目标客户画像（核心人群、场景、决策链路、信任来源）
3) 痛点清单（不少于8条，按优先级排序）
4) 竞争格局（头部玩法/同质化点/机会空白）
5) 差异化切入策略（定位一句话 + 3个差异化支点）
6) 内容矩阵（人设20%/科普50%/情感30%各给5个选题）
7) 线索转化设计（私信关键词、加微理由、首轮跟进话术）
8) 7天执行清单（每天3件事）
`.trim(),
          },
        ],
        { temperature: 0.6 }
      )
      setReport(content)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">行业分析</h1>
        <p className="text-gray-600">深度洞察市场机会与用户痛点</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              行业选择
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <button
                  key={industry.name}
                  onClick={() => setSelectedIndustry(industry.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedIndustry === industry.name
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{industry.name}</p>
                  <p className="text-sm text-gray-500">{industry.count} 个IP案例</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent-purple" />
              市场竞争分析
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">头部IP特征</h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">TOP 20%</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    账号人格鲜明，有独特记忆点
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    内容垂直度高，聚焦细分领域
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    更新频率稳定，日更或隔日更
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-accent-purple/5 to-transparent rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">市场机会</h3>
                  <span className="text-xs px-2 py-1 bg-accent-purple/10 text-accent-purple rounded-full">空白点</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                    本地化服务型IP稀缺
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                    专业科普内容深度不足
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                    情感共鸣类内容创新空间大
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI分析建议
            </h3>
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              按关键词逐项填写，点击生成完整行业分析报告。
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-white/80 mb-1">产品/服务</p>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="例如：餐饮连锁招商 / 老旧小区加装电梯 / AI获客系统"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">客单价/价格带</p>
                <input
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="例如：3万-8万 / 1999起 / 30万/单"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">地区/城市</p>
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="例如：四川·绵阳 / 全国 / 华东"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">目标客户</p>
                <input
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  placeholder="例如：县城门店老板 / 业主委员会负责人 / 中小企业老板"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">IP角色</p>
                <input
                  value={ipRole}
                  onChange={(e) => setIpRole(e.target.value)}
                  placeholder="例如：老板IP / 专家IP / 销售型IP / 运营型IP"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <p className="text-xs text-white/80 mb-1">账号基础</p>
                <input
                  value={accountBase}
                  onChange={(e) => setAccountBase(e.target.value)}
                  placeholder="例如：新号0粉 / 1万粉日更 / 私域500人"
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/20 px-4 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={generateReport}
              disabled={loading}
              className={clsx(
                'w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                loading ? 'bg-white/10 text-white/60' : 'bg-white/20 hover:bg-white/30'
              )}
            >
              {loading ? '生成中…' : '生成完整分析报告'} <ArrowRight className="w-4 h-4" />
            </button>
            {error ? <div className="mt-3 text-sm text-red-100">{error}</div> : null}
            {report ? (
              <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-sm whitespace-pre-wrap leading-relaxed">
                {report}
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-accent-orange" />
              目标用户画像
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">核心用户群体</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">年龄：</span>35-55岁</p>
                  <p><span className="font-medium">身份：</span>业主、准业主、家庭决策者</p>
                  <p><span className="font-medium">痛点：</span>加装电梯需求、选择困难、预算有限</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">内容偏好</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">偏好：</span>真实案例、政策解读</p>
                  <p><span className="font-medium">信任来源：</span>专业度、口碑评价</p>
                  <p><span className="font-medium">决策因素：</span>价格透明度、服务保障</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-red-500" />
              痛点挖掘
            </h2>
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{point.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      point.priority === '高' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {point.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              政策环境
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-1">利好政策</p>
                <p className="text-sm text-gray-700">2026年中央财政超长期特别国债支持老旧小区加装电梯</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-700 mb-1">地方加码</p>
                <p className="text-sm text-gray-700">四川省电梯安全条例5月1日起施行</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-700 mb-1">补贴标准</p>
                <p className="text-sm text-gray-700">四至六层25万元/台，七层及以上30万元/台</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndustryAnalysis
