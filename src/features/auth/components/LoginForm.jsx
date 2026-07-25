import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/useAuthStore';
import Icon from '../../../shared/components/ui/Icon';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const { login, isLoading, error: storeError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username.trim() || !password.trim()) {
      setValidationError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/');
    }
  };

  const errorMessage = validationError || storeError;

  return (
    <div className="w-full max-w-md bg-surface-container-high/80 backdrop-blur-2xl border border-surface-variant/30 rounded-3xl p-8 shadow-2xl shadow-primary/5 rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
          <Icon name="badge" className="text-3xl" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">تسجيل الدخول للموظفين</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">نظام الكاشير ونقاط البيع السريع</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error font-body-md text-sm flex items-center gap-3 animate-in fade-in duration-200">
          <Icon name="error" className="text-xl shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-label-lg text-label-lg text-on-surface mb-2 font-medium">اسم المستخدم</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              disabled={isLoading}
              className="w-full h-14 pr-12 pl-4 bg-surface-container-low border border-surface-variant/40 rounded-2xl text-on-surface text-lg placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50 font-body-md"
            />
            <Icon name="person" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
          </div>
        </div>

        <div>
          <label className="block font-label-lg text-label-lg text-on-surface mb-2 font-medium">كلمة المرور</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full h-14 pr-12 pl-4 bg-surface-container-low border border-surface-variant/40 rounded-2xl text-on-surface text-lg placeholder-on-surface-variant/50 font-data-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
            <Icon name="lock" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-primary hover:bg-primary-fixed-dim active:scale-[0.98] text-[#1A1D23] font-bold text-lg rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-[#1A1D23] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Icon name="login" className="text-xl" />
              <span>دخول الكاشير</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
