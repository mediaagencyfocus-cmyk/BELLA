import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);

      if (res.success) {
        if (res.role === 'admin') {
          setSuccessMsg('مرحباً بك مجدداً أيها المسؤول! جاري توجيهك إلى لوحة الإدارة...');
        } else {
          setSuccessMsg('تم تسجيل الدخول بنجاح! مرحباً بك.');
        }

        setTimeout(() => {
          setIsAuthModalOpen(false);
          setEmail('');
          setPassword('');
          setSuccessMsg('');
        }, 800);
      } else {
        setError(res.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = signup(name, email, password, phone);
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg('تم إنشاء الحساب بنجاح! مرحباً بك في BELLA SHOES.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setName('');
          setEmail('');
          setPassword('');
          setPhone('');
          setSuccessMsg('');
        }, 900);
      } else {
        setError(res.error || 'حدث خطأ أثناء إنشاء الحساب');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/75 luxury-modal-backdrop flex items-center justify-center p-4 overflow-y-auto text-right">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#111319] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            setIsAuthModalOpen(false);
            setError('');
            setSuccessMsg('');
          }}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Title */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-black dark:bg-[#161922] border border-[#00C8FF]/60 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,200,255,0.28)]">
            <span className="text-[#00C8FF] font-black text-xl">B</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 dark:text-white font-brand">
            {authModalMode === 'login' ? 'تسجيل الدخول الموحد' : 'إنشاء حساب جديد'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {authModalMode === 'login'
              ? 'أدخل بياناتك للمتابعة - يتعرف النظام تلقائياً على حسابك'
              : 'سجل حسابك للاستفادة من متابعة الطلبات والعروض الحصرية'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#00C8FF]/15 border border-[#00C8FF]/30 text-[#0088CC] dark:text-[#00C8FF] text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        {authModalMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                البريد الإلكتروني (Gmail)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-sm shadow-[0_4px_15px_rgba(0,200,255,0.3)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول'}
            </button>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00C8FF] shrink-0" />
              <span>نظام ذكي موحد: يتعرف تلقائياً على المسؤول ويوجهه للوحة الإدارة.</span>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setError('');
                }}
                className="text-xs text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white font-medium transition-colors cursor-pointer"
              >
                ليس لديك حساب بعد؟{' '}
                <span className="text-[#0099CC] dark:text-[#00C8FF] font-bold">إنشاء حساب جديد</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                رقم الهاتف (اختياري لتأكيد التوصيل)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0612345678"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اختر كلمة مرور من 6 أحرف على الأقل"
                  className="w-full h-11 pl-3 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#00C8FF] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-extrabold text-sm shadow-[0_4px_15px_rgba(0,200,255,0.3)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'جاري التسجيل...' : 'إنشاء حساب جديد'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setError('');
                }}
                className="text-xs text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white font-medium transition-colors cursor-pointer"
              >
                لديك حساب بالفعل؟{' '}
                <span className="text-[#0099CC] dark:text-[#00C8FF] font-bold">تسجيل الدخول</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
