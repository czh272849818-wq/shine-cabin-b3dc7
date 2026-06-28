import { useMemo, useState } from 'react'
import { Eye, EyeOff, Mail, MessageCircle, Orbit, Phone, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { authenticate, saveSession, type AuthMethod, type AuthMode } from '@/services/workspace'

const methodMeta = {
  phone: {
    label: '手机号',
    icon: Phone,
    hint: '使用手机号和密码登录，适合移动端用户。',
  },
  email: {
    label: '邮箱',
    icon: Mail,
    hint: '使用邮箱和密码登录，适合团队与后台管理。',
  },
  wechat: {
    label: '微信',
    icon: MessageCircle,
    hint: '微信扫码/授权登录，正式上线需配置微信开放平台。',
  },
} satisfies Record<AuthMethod, { label: string; icon: typeof Phone; hint: string }>

function Login() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [method, setMethod] = useState<AuthMethod>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const selectedMethod = useMemo(() => methodMeta[method], [method])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (method === 'wechat') {
      setNotice('微信登录需要先在 Netlify 配置微信开放平台 AppID/Secret 与回调服务。')
      return
    }

    const identifier = method === 'phone' ? phone.trim() : email.trim()
    if (!identifier) {
      setNotice(method === 'phone' ? '请输入手机号' : '请输入邮箱')
      return
    }
    if (password.length < 6) {
      setNotice('请输入至少 6 位密码')
      return
    }

    setLoading(true)
    setNotice('')
    try {
      const session = await authenticate({
        mode: authMode,
        method,
        identifier,
        password,
        name,
      })
      saveSession(session)
      navigate('/')
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between px-6 py-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
              <Orbit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-950">势能舱</p>
              <p className="text-xs text-gray-500">AI IP增长作战台</p>
            </div>
          </div>

          <div className="my-14">
            <p className="text-sm font-semibold text-primary">账号入口</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-950">
              让每个用户都能从登录开始进入自己的增长工作台。
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-gray-600">
              当前版本支持邮箱/手机号密码注册登录；微信入口预留给正式开放平台授权。
            </p>
          </div>

          <div className="grid gap-3 text-sm text-gray-600">
            {['账号数据进入云端存储', '手机号/邮箱可真实注册登录', '微信授权需要服务商配置'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
              {(['login', 'register'] as AuthMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAuthMode(item)}
                  className={clsx(
                    'rounded-md py-2 text-sm font-semibold',
                    authMode === item ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'
                  )}
                >
                  {item === 'login' ? '登录' : '注册'}
                </button>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2">
              {(['phone', 'email', 'wechat'] as AuthMethod[]).map((item) => {
                const Icon = methodMeta[item].icon
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMethod(item)
                      setNotice('')
                    }}
                    className={clsx(
                      'flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold',
                      method === item
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {methodMeta[item].label}
                  </button>
                )
              })}
            </div>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-950">{selectedMethod.label}{authMode === 'login' ? '登录' : '注册'}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{selectedMethod.hint}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && method !== 'wechat' ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700">姓名</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入姓名"
                    className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ) : null}

              {method === 'phone' ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">手机号</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入手机号"
                      inputMode="tel"
                      className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">密码</label>
                    <div className="relative mt-2">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authMode === 'login' ? '请输入密码' : '设置登录密码'}
                        className="h-11 w-full rounded-lg border border-gray-200 px-4 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label="切换密码显示"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {method === 'email' ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">邮箱</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      inputMode="email"
                      className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">密码</label>
                    <div className="relative mt-2">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authMode === 'login' ? '请输入密码' : '设置登录密码'}
                        className="h-11 w-full rounded-lg border border-gray-200 px-4 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        aria-label="切换密码显示"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {method === 'wechat' ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <MessageCircle className="mx-auto h-10 w-10 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-gray-950">微信授权入口</p>
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    微信真实登录需要微信开放平台 AppID、Secret、回调域名与服务端换码逻辑。配置完成后可启用。
                  </p>
                </div>
              ) : null}

              {notice ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{notice}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className={clsx('h-11 w-full rounded-lg text-sm font-semibold text-white', loading ? 'bg-gray-300' : 'bg-primary hover:bg-primary-light')}
              >
                {method === 'wechat'
                  ? '使用微信继续'
                  : loading
                    ? '处理中'
                    : authMode === 'login'
                      ? '进入工作台'
                      : '创建账号'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
