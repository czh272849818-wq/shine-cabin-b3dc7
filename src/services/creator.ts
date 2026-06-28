import { chatCompletionStream } from '@/services/llm'

export type CreatorStage = 'idea' | 'script' | 'publish' | 'review' | 'monetize'

export const creatorStages: Array<{
  key: CreatorStage
  label: string
  title: string
  desc: string
}> = [
  { key: 'idea', label: '选题', title: '找适合多平台复用的题', desc: '把热点、用户痛点和账号方向压成能分发到多个平台的选题池。' },
  { key: 'script', label: '脚本', title: '把选题拆成平台版本', desc: '给出通用脚本，以及抖音、小红书、视频号、B站的不同表达。' },
  { key: 'publish', label: '发布', title: '安排多平台包装与发布时间', desc: '统一标题、封面、标签和评论区引导，并适配不同平台格式。' },
  { key: 'review', label: '复盘', title: '找出哪个平台真正有效', desc: '看播放、完播、互动、收藏和转化，判断哪种分发最划算。' },
  { key: 'monetize', label: '变现', title: '接住跨平台线索和成交', desc: '把流量导向咨询、私信、表单或成交页，并记录来源平台。' },
]

export async function streamCreatorAdvice(
  stage: CreatorStage,
  prompt: string,
  onDelta: (text: string) => void
) {
  const stageMeta = creatorStages.find((item) => item.key === stage)
  return chatCompletionStream(
    [
      {
        role: 'system',
        content:
          '你是全平台自媒体工作台的增长教练。你只输出自媒体工作者真正需要的执行清单，拒绝空话。结果必须能直接拿去发、拍、剪、分发、复盘。',
      },
      {
        role: 'user',
        content: `
当前阶段：${stageMeta?.title || stage}
阶段说明：${stageMeta?.desc || ''}
用户输入：${prompt.trim() || '暂无'}

请输出：
1. 一句话本质判断
2. 3个最重要动作
3. 具体产出物
4. 最容易踩坑的地方
5. 下一步怎么继续推进
`.trim(),
      },
    ],
    { temperature: 0.55, onDelta }
  )
}
