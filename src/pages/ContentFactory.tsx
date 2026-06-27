import { useState } from 'react'
import {
  FileText,
  Video,
  Calendar,
  Sparkles,
  Play,
  ArrowRight,
  Image as ImageIcon,
  Camera,
  Wand2,
  Send,
} from 'lucide-react'
import clsx from 'clsx'
import { chatCompletion } from '@/services/llm'

const contentTypes = [
  { type: 'IP人设类', percentage: 20, description: '建立信任', color: 'from-purple-500 to-pink-500' },
  { type: '干货科普类', percentage: 50, description: '解决痛点', color: 'from-blue-500 to-cyan-500' },
  { type: '情感共鸣类', percentage: 30, description: '引发传播', color: 'from-orange-500 to-red-500' },
]

const sampleScripts = [
  { title: '2026年最新补贴政策解读', type: '干货科普', likes: 2300, views: '45.2K' },
  { title: '为什么四川人的电梯，必须让四川人来修', type: 'IP人设', likes: 1890, views: '38.7K' },
  { title: '王奶奶终于下楼晒太阳了', type: '情感共鸣', likes: 5800, views: '89.5K' },
]

type ContentMode = 'video' | 'graphic'
type GoalType = '涨粉' | '完播' | '转化'

function ContentFactory() {
  const [mode, setMode] = useState<ContentMode>('video')
  const [selectedType, setSelectedType] = useState('干货科普类')
  const [goal, setGoal] = useState<GoalType>('转化')
  const [topic, setTopic] = useState('')
  const [background, setBackground] = useState('')
  const [videoStyle, setVideoStyle] = useState<'AI视频' | '拍摄视频' | '真人+AI混剪'>('AI视频')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const buildVideoPrompt = () => {
    const typeHint =
      selectedType === 'IP人设类'
        ? 'IP人设类（20%）：强人设+强反差+强真实，重点建立信任与记忆点。'
        : selectedType === '干货科普类'
          ? '干货科普类（50%）：痛点提问+行业揭秘+情绪共鸣，重点解决痛点与建立权威。'
          : '情感共鸣类（30%）：真实故事+情绪共鸣，重点引发传播与分享。'

    const goalHint =
      goal === '涨粉'
        ? '目标：涨粉。强调强人设、强反差、强真实，结尾强关注理由。'
        : goal === '完播'
          ? '目标：完播。强调前3秒钩子、悬念递进、结尾彩蛋/反转。'
          : '目标：转化。强调信任建立、专业证据、引导私信/加微的自然行动。'

    const styleHint =
      videoStyle === 'AI视频'
        ? '制作方式：AI视频。请输出AI画面生成建议（每个镜头给出画面描述与关键词）。'
        : videoStyle === '拍摄视频'
          ? '制作方式：拍摄视频。请输出拍摄任务单（场景、道具、镜头清单、口播要点、注意事项）。'
          : '制作方式：真人+AI混剪。请输出真人证据镜头 + AI补充镜头的组合方案。'

    return `
你是“势能舱”平台的内容导演与短视频编导。
严格使用三大公式：
1) 强人设 + 强反差 + 强真实 = 稳定涨粉
2) 痛点提问 + 行业揭秘 + 情绪共鸣 = 搞定完播
3) 固定挑战 + 随机结果 + 真实反应 = 爆款流量

请基于以下输入输出一条可直接拍/可直接做AI视频的短视频完整方案，输出必须结构化、可复制落地：

【内容类型】${selectedType}。${typeHint}
【目标】${goal}。${goalHint}
【主题】${topic.trim() || '（未填写）'}
【补充背景】${background.trim() || '（无）'}
【${styleHint}】

输出格式：
1) 标题（给出10个：3个冲突型、3个数据型、2个故事型、2个利他型）
2) 封面文案（6条，短句）
3) 开头3秒钩子（给出3版）
4) 脚本结构（口播文案：按0-5秒、5-15秒、15-35秒、35-50秒、50-60秒拆分）
5) 分镜/画面（至少8个镜头，镜头说明+画面内容+字幕要点）
6) 互动引导与转化话术（置顶评论1条、私信引导关键词、结尾CTA）
7) 发布建议（平台：抖音/小红书/视频号各1条差异化建议）
`.trim()
  }

  const buildGraphicPrompt = () => {
    const typeHint =
      selectedType === 'IP人设类'
        ? 'IP人设类：强调强人设+强反差+强真实，建立信任与记忆点。'
        : selectedType === '干货科普类'
          ? '干货科普类：以清单化/步骤化呈现，强调避坑与证据。'
          : '情感共鸣类：强调故事线、细节与情绪递进。'

    const goalHint =
      goal === '涨粉'
        ? '目标：涨粉。标题更抓眼，结尾引导关注/收藏。'
        : goal === '完播'
          ? '目标：完播（阅读完成）。用强结构、强节奏、强排版，让用户一路看完。'
          : '目标：转化。正文要能“解决问题 + 建立权威 + 自然引导咨询”。'

    return `
你是“势能舱”平台的小红书/公众号图文内容主编。
请基于以下输入，生成一篇可直接发布的图文内容（偏小红书风格，但也可一键改成公众号长文）。

【内容类型】${selectedType}。${typeHint}
【目标】${goal}。${goalHint}
【主题】${topic.trim() || '（未填写）'}
【补充背景】${background.trim() || '（无）'}

输出格式：
1) 标题（10个：3个数字清单型、3个反差冲突型、2个避坑型、2个故事型）
2) 开头第一屏（100-160字，结论先行+强情绪）
3) 正文（按小红书分段：每段最多3行；不少于6段；穿插小标题与emoji占位符但不要真的输出emoji）
4) 可收藏清单（10条以内，强可执行）
5) 尾部引导（评论区互动问题1个 + 私信引导关键词1个 + 关注理由1句）
6) 配图规划（9宫格：每张图写“画面内容/要点文案/版式建议”）
7) AI配图提示词（给3条：封面海报、信息图、场景氛围图；中文为主，便于直接丢给生图工具）
`.trim()
  }

  const runGenerate = async () => {
    if (!topic.trim()) {
      setError('请先输入主题')
      return
    }
    if (loading) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const prompt = mode === 'video' ? buildVideoPrompt() : buildGraphicPrompt()
      const content = await chatCompletion([
        { role: 'system', content: '你输出的内容必须结构化，且每一段都可直接复制执行。' },
        { role: 'user', content: prompt },
      ])
      setResult(content)
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">内容工厂</h1>
          <p className="text-gray-600">视频创作（AI视频/拍摄）与图文创作（AI图文）的一体化工作台</p>
        </div>
        <button
          type="button"
          onClick={runGenerate}
          disabled={loading}
          className={clsx(
            'px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2',
            loading
              ? 'bg-gray-200 text-gray-500'
              : 'bg-gradient-to-r from-primary to-accent-purple text-white hover:shadow-lg'
          )}
        >
          <Sparkles className="w-5 h-5" />
          {loading ? '生成中…' : 'AI一键生成'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {mode === 'video' ? (
                  <>
                    <Video className="w-6 h-6 text-accent-purple" />
                    视频创作
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-accent-orange" />
                    图文创作
                  </>
                )}
              </h2>

              <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                    mode === 'video'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Video className="w-4 h-4" />
                  视频
                </button>
                <button
                  type="button"
                  onClick={() => setMode('graphic')}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                    mode === 'graphic'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  图文
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {contentTypes.map((item) => (
                <div
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedType === item.type
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center mb-1">{item.type}</h3>
                  <p className="text-xs text-gray-500 text-center mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-primary text-center">{item.percentage}%</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">主题（你想解决的一个具体问题）</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：AI获客做IP，第一条视频应该怎么拍？或：老板IP如何用三大公式做爆款？"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent h-28 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['涨粉', '完播', '转化'] as GoalType[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={clsx(
                        'px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
                        goal === g
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {mode === 'video' ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">视频方式</label>
                    <div className="grid grid-cols-1 gap-2">
                      {(['AI视频', '拍摄视频', '真人+AI混剪'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setVideoStyle(s)}
                          className={clsx(
                            'px-3 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 justify-center',
                            videoStyle === s
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {s === 'AI视频' ? (
                            <Wand2 className="w-4 h-4" />
                          ) : s === '拍摄视频' ? (
                            <Camera className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充背景（可选）</label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="例如：行业/产品/客单价/目标客户画像/你的人设角色/你目前账号基础…"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
              />
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent-purple/5 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">工作流（你只需要按顺序执行）</h3>
              {mode === 'video' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">1. 选题</p>
                    <p className="text-gray-600">从咨询/评论/热点提炼一个强痛点问题</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">2. 脚本</p>
                    <p className="text-gray-600">套三大公式输出钩子、结构、证据与CTA</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">3. 制作</p>
                    <p className="text-gray-600">AI视频/拍摄/混剪，按镜头清单快速出片</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">4. 发布复盘</p>
                    <p className="text-gray-600">一稿多发，多平台改标题与首屏；数据回流</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">1. 结论先行</p>
                    <p className="text-gray-600">第一屏直接给结论，快速抓住注意力</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">2. 清单化</p>
                    <p className="text-gray-600">把价值做成可收藏的清单/步骤/对比表</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">3. 配图规划</p>
                    <p className="text-gray-600">9宫格分镜：封面海报+信息图+场景氛围图</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-xl border border-white">
                    <p className="font-medium mb-1">4. 引导转化</p>
                    <p className="text-gray-600">互动问题 + 私信关键词 + 关注理由，闭环线索</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={runGenerate}
              disabled={loading}
              className={clsx(
                'w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                loading
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-gradient-to-r from-primary to-accent-purple text-white hover:shadow-lg'
              )}
            >
              <Send className="w-5 h-5" />
              {mode === 'video' ? (loading ? '生成视频方案中…' : '生成视频方案') : loading ? '生成图文方案中…' : '生成图文方案'}
            </button>

            {error ? (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">生成结果</h3>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-sm font-medium text-primary hover:text-accent-purple"
                  >
                    复制全部
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent-orange" />
                历史内容资产
              </h2>
              <button className="text-primary hover:text-accent-purple font-medium flex items-center gap-1">
                查看全部 <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {sampleScripts.map((script, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{script.title}</h3>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{script.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👁 {script.views}</span>
                    <span>❤️ {script.likes}</span>
                    <button className="ml-auto text-primary hover:text-accent-purple flex items-center gap-1">
                      <Play className="w-4 h-4" /> 复用
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              内容日历
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-blue-500">
                <p className="text-xs text-blue-600 mb-1">今天 14:00</p>
                <p className="text-sm font-medium text-gray-900">发布政策解读视频</p>
                <p className="text-xs text-gray-500">预计播放 50K</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border-l-4 border-purple-500">
                <p className="text-xs text-purple-600 mb-1">明天 10:00</p>
                <p className="text-sm font-medium text-gray-900">IP人设视频拍摄</p>
                <p className="text-xs text-gray-500">预计时长 60秒</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-transparent rounded-lg border-l-4 border-orange-500">
                <p className="text-xs text-orange-600 mb-1">后天 15:00</p>
                <p className="text-sm font-medium text-gray-900">情感共鸣内容发布</p>
                <p className="text-xs text-gray-500">待定选题</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent-purple rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">🎯 发布平台</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-sm">抖音</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-full">已连接</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-sm">小红书</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-full">已连接</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-sm">视频号</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-full">已连接</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-sm">B站</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-full">未连接</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 内容矩阵规划</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">IP人设类</span>
                  <span className="text-sm font-medium text-primary">20%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">干货科普类</span>
                  <span className="text-sm font-medium text-primary">50%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">情感共鸣类</span>
                  <span className="text-sm font-medium text-primary">30%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentFactory
