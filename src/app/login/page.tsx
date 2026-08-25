'use client';
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      // عملية إنشاء حساب جديد مع الاسم الكامل
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })
      if (error) setMessage(error.message)
      else setMessage('تم إنشاء الحساب بنجاح! تفقد بريدك الإلكتروني للتأكيد.')
    } else {
      // عملية تسجيل الدخول
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard' // أو المسار الذي تريده بعد الدخول
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'right', direction: 'rtl' }}>
      <h2>{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
      
      <form onSubmit={handleAuth}>
        {isSignUp && (
          <div style={{ marginBottom: '15px' }}>
            <label>الاسم الكامل:</label>
            <input 
              type="text" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>البريد الإلكتروني:</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور:</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {message && <p style={{ color: 'red' }}>{message}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? 'جاري التحميل...' : isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}
        </button>
      </form>

      <button 
        onClick={() => setIsSignUp(!isSignUp)} 
        style={{ marginTop: '15px', background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}
      >
        {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
      </button>
    </div>
  )
}