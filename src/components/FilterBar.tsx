import React from 'react';
import { Search, X, Tag, SlidersHorizontal, Award } from 'lucide-react';
import { PriceFilter } from '../types/game';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  availableGenres: string[];
  selectedPriceFilter: PriceFilter;
  onSelectPriceFilter: (filter: PriceFilter) => void;
  editorChoiceOnly: boolean;
  onToggleEditorChoice: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onSelectGenre,
  availableGenres,
  selectedPriceFilter,
  onSelectPriceFilter,
  editorChoiceOnly,
  onToggleEditorChoice,
  onResetFilters,
  hasActiveFilters,
}) => {
  const priceOptions: { label: string; value: PriceFilter }[] = [
    { label: '価格指定なし', value: 'all' },
    { label: '〜500円', value: 'under_500' },
    { label: '〜1,000円', value: 'under_1000' },
    { label: '〜2,000円', value: 'under_2000' },
    { label: '〜3,000円', value: 'under_3000' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-6 space-y-4">
      {/* 検索入力 & クイックフィルター */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 検索バー */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ゲームタイトル、メーカー、キーワードで検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nintendo-red/20 focus:border-nintendo-red transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 編集部おすすめトグル & リセット */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEditorChoice}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              editorChoiceOnly
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className={`w-4 h-4 ${editorChoiceOnly ? 'fill-current' : 'text-amber-500'}`} />
            <span>神ゲー厳選</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>リセット</span>
            </button>
          )}
        </div>
      </div>

      {/* ジャンル絞り込み（横スクロールチップ） */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 px-0.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span>ジャンルで絞り込み</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1">
          <button
            onClick={() => onSelectGenre('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            すべて
          </button>
          {availableGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-nintendo-red text-white shadow-sm shadow-red-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* 価格帯クイックフィルター */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 px-0.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>予算・価格帯</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1">
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelectPriceFilter(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPriceFilter === opt.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
