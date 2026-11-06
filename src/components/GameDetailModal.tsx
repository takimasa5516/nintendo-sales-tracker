import React, { useEffect } from 'react';
import { X, ExternalLink, Heart, Star, Clock, CheckCircle2, ThumbsUp, Tag } from 'lucide-react';
import { GameItem } from '../types/game';
import { formatYen, getSaleRemainingText, getScoreBadgeStyle } from '../utils/formatters';

interface GameDetailModalProps {
  game: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  const remaining = getSaleRemainingText(game.saleEndsAt);
  const scoreStyle = getScoreBadgeStyle(game.score.metacritic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* モーダル枠 */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto no-scrollbar flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* クローズボタン */}
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヒーロー画像 */}
        <div className="relative aspect-video w-full bg-slate-900">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* バッジ群 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-nintendo-red text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow">
                  -{game.discountRate}% OFF
                </span>
                <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{remaining.text}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
                {game.title}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {game.publisher}
              </p>
            </div>

            {/* お気に入りボタン */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 詳細ボディ */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* 価格 & スコアサマリー */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* 価格 */}
            <div>
              <span className="text-xs font-bold text-slate-500">セール価格</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-nintendo-red">
                  {formatYen(game.discountPrice)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatYen(game.regularPrice)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                お得額: <span className="font-bold text-slate-700">{formatYen(game.regularPrice - game.discountPrice)}</span> 安くなっています
              </p>
            </div>

            {/* スコア指標 */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">評価・レビュー</span>
              <div className="flex items-center gap-2 mt-1">
                {game.score.metacritic !== null ? (
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Metacritic {game.score.metacritic}点</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">集計中</span>
                )}

                {game.score.steamPositiveRate && (
                  <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Steam好評率 {game.score.steamPositiveRate}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* おすすめ一言寸評 */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-4 bg-nintendo-red rounded-full"></span>
              <span>おすすめポイント & 本作の魅力</span>
            </h4>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-sm text-amber-950 leading-relaxed">
              <p className="font-medium">{game.shortReview}</p>

              {game.recommendedFor && game.recommendedFor.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200/50 flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-bold text-amber-900">こんな人におすすめ:</span>
                  {game.recommendedFor.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 見どころ箇条書き */}
          {game.highlights && game.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-4 bg-emerald-600 rounded-full"></span>
                <span>注目ポイント・特徴</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {game.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ジャンルタグ */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">ジャンル:</span>
            {game.genres.map((g) => (
              <span key={g} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* フッター：購入導線 */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 block">ニンテンドーeショップ公式</span>
            <span className="text-lg sm:text-xl font-black text-nintendo-red">
              {formatYen(game.discountPrice)}
            </span>
          </div>

          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 bg-nintendo-red hover:bg-nintendo-darkRed text-white text-sm font-bold py-3 px-5 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95 text-center"
          >
            <span>マイニンテンドーストアで購入</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
