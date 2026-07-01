import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function NotFound() {
  useEffect(() => {
    // Micro-interaction: Add subtle parallax effect to glass panels
    const handleMouseMove = (e) => {
      const panels = document.querySelectorAll('.glass-panel');
      const x = (window.innerWidth / 2 - e.pageX) / 100;
      const y = (window.innerHeight / 2 - e.pageY) / 100;
      
      panels.forEach(panel => {
        panel.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <main className="relative z-10 w-full max-w-2xl px-gutter mx-auto h-screen flex items-center justify-center">
      <div className="glass-panel rounded-xl p-stack-lg md:p-[64px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Error Code */}
        <div className="mb-stack-lg relative">
          <h1 className="text-[120px] md:text-[180px] leading-none font-bold text-primary tracking-tighter drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <Icon name="search_off" className="text-[150px] md:text-[200px] text-primary" />
          </div>
        </div>
        
        {/* Message */}
        <h2 className="font-headline-lg text-headline-lg md:text-[40px] md:leading-[48px] text-on-surface mb-stack-sm">
          عذراً، الصفحة غير موجودة
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-stack-lg">
          يبدو أنك قد انحرفت عن المسار. الصفحة التي تبحث عنها غير متوفرة في النظام أو تم نقلها.
        </p>
        
        {/* Action */}
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-body-lg text-body-lg font-semibold px-8 py-4 rounded-full hover:bg-primary-fixed transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <Icon name="dashboard" className="text-lg" />
          <span>العودة للوحة القيادة</span>
        </Link>
        
        {/* System Info */}
        <div className="mt-stack-lg pt-stack-md border-t border-white/5 w-full">
          <p className="font-data-mono text-data-mono text-on-surface-variant/50 text-xs text-center flex items-center justify-center gap-2">
            <Icon name="terminal" className="text-[14px]" />
            SYS_ERR_404_NOT_FOUND // TRACE_ID: XA-992-BF
          </p>
        </div>
      </div>

      {/* Atmospheric Background Element */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10 opacity-30"></div>
    </main>
  );
}
