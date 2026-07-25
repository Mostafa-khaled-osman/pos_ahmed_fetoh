import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - نظام نقاط البيع</title>
        <meta name="description" content="تسجيل دخول الكاشير والموظفين لنظام نقاط البيع" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface p-4 relative overflow-hidden font-body-md antialiased rtl">
        {/* Background Ambient Glows */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <LoginForm />
      </div>
    </>
  );
}
