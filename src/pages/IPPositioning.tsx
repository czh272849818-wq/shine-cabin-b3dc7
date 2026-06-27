import { useState } from 'react'
import { Sparkles, Target, Heart, Users, Palette, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const suggestedNames = [
  { name: '伟绵·大地之梯', meaning: '承载行业的大地，让每一次向上都踏实' },
  { name: '电梯匠人老王', meaning: '朴实专业，值得信赖的本地专家' },
  { name: '绵阳电梯通', meaning: '本地化服务，懂你更懂电梯' },
]

const personaTraits = [
  { trait: '踏实', description: '工地出身，脏活累活自己先上', selected: true },
  { trait: '真诚', description: '绝不忽悠，能做的和不能做的都说清楚', selected: true },
  { trait: '专业', description: '有底气的专业度，每个细节都经得起推敲', selected: true },
  { trait: '无我', description: '把客户的事当自己的事', selected: true },
]

function IPPositioning() {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [industry, setIndustry] = useState('建筑工程')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const generateNames = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content:
              '你是AI+IP打造平台的IP定位与人设策略专家。输出要具体、可执行、可复制。不要空话。',
          },
          {
            role: 'user',
            content: `
行业：${industry}
关键词：${keywords.trim() || '（无）'}

请输出：
1) IP命名候选 10 个（每个包含：名称 + 一句话解释 + 适配平台标签）
2) 账号定位一句话（30字内）
3) 三句自我介绍（分别适配：抖音/小红书/视频号）
4) 选题方向 12 个（按：人设/科普/情感 三类分组）
5) 避坑清单 6 条
`.trim(),
          },
        ],
        { temperature: 0.7 }
      )
      setResult(content)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">IP定位</h1>
        <p className="text-gray-600">AI驱动的个性化IP打造，让你的品牌脱颖而出</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-purple" />
              IP命名大师
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择你的行业</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="建筑工程">建筑工程</option>
                <option value="教育培训">教育培训</option>
                <option value="医疗健康">医疗健康</option>
                <option value="金融服务">金融服务</option>
                <option value="餐饮美食">餐饮美食</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">输入关键词（可选）</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例如：专业、可靠、本地化、老板IP、工地真实..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={generateNames}
              disabled={loading}
              className={clsx(
                'w-full py-3 rounded-xl font-medium transition-all mb-6 flex items-center justify-center gap-2',
                loading
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-gradient-to-r from-primary to-accent-purple text-white hover:shadow-lg'
              )}
            >
              <Sparkles className="w-5 h-5" />
              {loading ? '生成中…' : 'AI生成IP方案'}
            </button>

            {error ? (
              <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            ) : null}

            <div className="space-y-4">
              {suggestedNames.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setSelectedName(item.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedName === item.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {selectedName === item.name && (
                      <span className="px-3 py-1 bg-primary text-white text-xs rounded-full">已选择</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              人格画像设计
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色定位</label>
                <input
                  type="text"
                  defaultValue="电梯匠人"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">语言风格</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>朴实真诚</option>
                  <option>专业严谨</option>
                  <option>幽默风趣</option>
                  <option>温暖亲切</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">核心特质（可多选）</label>
              <div className="grid grid-cols-2 gap-3">
                {personaTraits.map((trait) => (
                  <div
                    key={trait.trait}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      trait.selected ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{trait.trait}</span>
                      {trait.selected && <span className="text-primary">✓</span>}
                    </div>
                    <p className="text-xs text-gray-600">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">品牌标语</label>
              <input
                type="text"
                defaultValue="不做行业第一，只做承载行业的大地"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6 text-accent-orange" />
              视觉风格建议
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary to-accent-purple"></div>
                <p className="text-sm font-medium text-gray-900">主色调</p>
                <p className="text-xs text-gray-500">深邃蓝+科技紫</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500"></div>
                <p className="text-sm font-medium text-gray-900">强调色</p>
                <p className="text-xs text-gray-500">活力橙</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-300"></div>
                <p className="text-sm font-medium text-gray-900">中性色</p>
                <p className="text-xs text-gray-500">深灰+浅灰</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">💡 爆款公式</h3>
            <div className="space-y-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">稳定涨粉公式</p>
                <p className="text-white/80">强人设 + 强反差 + 强真实</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">完播率公式</p>
                <p className="text-white/80">痛点提问 + 行业揭秘 + 情绪共鸣 + 搞完播</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">爆款流量公式</p>
                <p className="text-white/80">固定挑战 + 随机结果 + 真实反应</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              差异化定位
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs font-medium text-red-700 mb-1">传统IP</p>
                <p className="text-sm text-gray-700">精致专业、炫技展示</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-1">你的IP</p>
                <p className="text-sm text-gray-700">朴实真诚、解决问题</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              品牌价值观
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              "无我利他" - 内容不应是"我们有多厉害"的灌输，而是"我们帮你解决了什么问题"的自然展现。
            </p>
            <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              保存IP定位 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-accent-orange to-red-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-3">🎯 下一步</h3>
            <p className="text-sm text-white/90 mb-4">
              完成IP定位后，进入内容工厂开始创作你的第一条爆款内容！
            </p>
            <button className="w-full py-2 bg-white text-accent-orange rounded-lg font-medium hover:bg-white/90 transition-colors">
              前往内容工厂
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IPPositioning
