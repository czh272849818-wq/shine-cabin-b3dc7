import { useMemo, useState } from 'react'
import { Eye, EyeOff, Mail, MessageCircle, Orbit, Phone, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'login' | 'register'
type AuthMethod = 'phone' | 'email' | 'wechat'

const methodMeta = {
  phone: {
    label: '手机号',
    icon: Phone,
    hint: '使用手机号和验证码登录，适合移动端用户。',
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
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()

  const selectedMethod = useMemo(() => methodMeta[method], [method])

  const enterApp = (label: string) => {
    localStorage.setItem('shine_cabin_session', 'active')
    localStorage.setItem(
      'shine_cabin_user',
      JSON.stringify({
        method,
        name: name.trim() || (method === 'phone' ? phone : method === 'email' ? email : '微信用户'),
        loginAt: new Date().toISOString(),
      })
    )
    setNotice(label)
    navigate('/')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (method === 'phone') {
      if (!phone.trim()) {
        setNotice('请输入手机号')
        return
      }
      if (!code.trim()) {
        setNotice('请输入验证码。当前版本为演示验证码流程，正式短信需接入短信服务。')
        return
      }
      enterApp(authMode === 'login' ? '手机号登录成功' : '手机号注册成功')
      return
    }

    if (method === 'email') {
      if (!email.trim()) {
        setNotice('请输入邮箱')
        return
      }
      if (!password.trim()) {
        setNotice('请输入密码')
        return
      }
      enterApp(authMode === 'login' ? '邮箱登录成功' : '邮箱注册成功')
      return
    }

    enterApp('微信授权成功')
  }

  const sendCode = () => {
    if (!phone.trim()) {
      setNotice('先输入手机号，再获取验证码')
      return
    }
    setCode('123456')
    setNotice('演示验证码已填入：123456。正式上线需接入短信服务。')
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
              当前版本支持邮箱、手机号、微信三种入口。短信和微信正式上线需要接入对应服务商密钥。
            </p>
          </div>

          <div className="grid gap-3 text-sm text-gray-600">
            {['邮箱密码适合团队成员', '手机号验证码适合客户快速进入', '微信授权适合中国用户习惯'].map((item) => (
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
                    <label className="text-sm font-semibold text-gray-700">验证码</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="6位验证码"
                        inputMode="numeric"
                        className="h-11 flex-1 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={sendCode}
                        className="h-11 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        获取
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
                    当前为产品演示入口。正式上线时接入微信开放平台 AppID、回调地址和服务端换码逻辑。
                  </p>
                </div>
              ) : null}

              {notice ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{notice}</div> : null}

              <button type="submit" className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-light">
                {method === 'wechat'
                  ? '使用微信继续'
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
