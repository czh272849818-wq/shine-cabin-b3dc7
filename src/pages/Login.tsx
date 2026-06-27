import { useState } from 'react'
import { Eye, EyeOff, Orbit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7F6] p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
            <Orbit className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-950">势能舱</h1>
          <p className="mt-2 text-sm text-gray-500">AI IP增长作战台</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`rounded-md py-2 text-sm font-semibold ${isLogin ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`rounded-md py-2 text-sm font-semibold ${!isLogin ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin ? (
            <div>
              <label className="text-sm font-semibold text-gray-700">姓名</label>
              <input className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-gray-700">手机号/邮箱</label>
            <input className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">密码</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
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

          <button type="submit" className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-light">
            {isLogin ? '进入工作台' : '创建账号'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm font-semibold text-primary"
        >
          {isLogin ? '还没有账号，立即注册' : '已有账号，立即登录'}
        </button>
      </div>
    </div>
  )
}

export default Login
