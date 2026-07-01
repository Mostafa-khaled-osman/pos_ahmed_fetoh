import React from 'react';
import Icon from '../../../shared/components/ui/Icon';

export default function TopBar({ searchQuery, onSearchChange }) {
  return (
    <div className="flex justify-between items-center mb-stack-lg">
      <h1 className="font-headline-lg text-headline-lg">كتالوج المنتجات</h1>
      <div className="relative w-full md:w-72 h-12 glass-panel rounded-lg gold-border-focus flex items-center px-4 transition-colors">
        <Icon name="search" className="text-on-surface-variant ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-on-surface font-body-md placeholder-on-surface-variant/50 focus:ring-0"
          placeholder="بحث عن منتجاتنا..."
        />
      </div>
    </div>
  );
}
