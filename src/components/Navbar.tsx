import React from 'react';
import { Heart, RefreshCw } from 'lucide-react';

interface NavbarProps {
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalGamesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoriteCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  totalGamesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ & タイトル */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-nintendo-red to-rose-500 text-white shadow-md shadow-red-200">
              <span className="text-xl font-black tracking-tighter">SW</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  Switch<span className="text-nintendo-red">セールナビ</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-nintendo-red border border-red-200">
                  高評価ソフト特化
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                マイニンテンドーストアのセール対象から名作・神ゲーを厳選
              </p>
            </div>
          </div>

          {/* 右側アクション & ステータス */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 更新ステータス */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
              <span>毎日自動更新（現在 {totalGamesCount} 本）</span>
            </div>

            {/* お気に入り切り替えボタン */}
            <button
              onClick={onToggleFavoritesOnly}
              aria-label="お気に入りフィルター"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                showFavoritesOnly
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  showFavoritesOnly ? 'fill-current text-white' : 'text-rose-500'
                }`}
              />
              <span>お気に入り</span>
              {favoriteCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    showFavoritesOnly ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                  }`}
                >
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
