import React from 'react';
import { Star, Percent, ArrowDown10, Clock } from 'lucide-react';
import { SortOption } from '../types/game';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

export const SortBar: React.FC<SortBarProps> = ({
  currentSort,
  onSortChange,
  resultCount,
}) => {
  const sortOptions: { label: string; value: SortOption; icon: React.ReactNode }[] = [
    { label: '高評価順', value: 'score_desc', icon: <Star className="w-3.5 h-3.5" /> },
    { label: '割引率順', value: 'discount_desc', icon: <Percent className="w-3.5 h-3.5" /> },
    { label: '価格が安い順', value: 'price_asc', icon: <ArrowDown10 className="w-3.5 h-3.5" /> },
    { label: '終了間近順', value: 'ends_soon', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
      {/* 件数表示 */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="font-bold text-slate-900 text-base">{resultCount}</span>
        <span>本のセールソフト</span>
      </div>

      {/* ソートタブボタン */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-200/70 p-1 rounded-xl">
        {sortOptions.map((opt) => {
          const isActive = currentSort === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={isActive ? 'text-nintendo-red' : 'text-slate-400'}>
                {opt.icon}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
