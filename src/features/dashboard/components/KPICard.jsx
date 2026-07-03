import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function KPICard({ title, value, unit, icon, trend, loading, variant = 'default' }) {
  if (loading) {
    return (
      <div className={`rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden animate-pulse ${variant === 'glow' ? 'glass-panel-glow' : 'glass-panel'}`}>
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-surface-variant/30" />
          <div className="w-16 h-6 rounded bg-surface-variant/20" />
        </div>
        <div className="mt-2">
          <div className="h-5 w-24 bg-surface-variant/30 rounded mb-2" />
          <div className="h-8 w-32 bg-surface-variant/40 rounded" />
        </div>
      </div>
    );
  }

  const isPositive = trend >= 0;

  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group ${variant === 'glow' ? 'glass-panel-glow' : variant === 'error' ? 'glass-panel-error' : 'glass-panel'}`}>
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-colors duration-500 ${
        variant === 'glow' ? 'bg-primary/5 group-hover:bg-primary/10' :
        variant === 'error' ? 'bg-error/5 group-hover:bg-error/10' :
        'bg-surface-variant/20 group-hover:bg-surface-variant/30'
      }`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-surface-variant">
          <Icon name={icon} className={`text-2xl ${variant === 'glow' ? 'text-primary' : variant === 'error' ? 'text-error' : 'text-on-surface'}`} />
        </div>
        
        {trend !== undefined && (
          <span className={`flex items-center gap-1 font-data-mono text-sm px-2 py-1 rounded-md ${
            isPositive ? 'text-secondary bg-secondary/10 border border-secondary/20' : 'text-error bg-error/10 border border-error/20'
          }`}>
            <Icon name={isPositive ? 'trending_up' : 'trending_down'} className="text-sm" />
            {isPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-1 relative z-10 mt-2">
        <h3 className="font-body-md text-body-md text-on-surface-variant">{title}</h3>
        <div className="font-headline-lg text-headline-lg text-on-surface font-data-mono tracking-tight flex items-baseline gap-1">
          {typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : value}
          {unit && <span className="text-sm text-on-surface-variant font-body-md">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
