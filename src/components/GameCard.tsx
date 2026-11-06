import React from 'react';
import { ExternalLink, Heart, Star, Clock, Sparkles, MessageSquareQuote } from 'lucide-react';
import { GameItem } from '../types/game';
import { formatYen, getSaleRemainingText, getScoreBadgeStyle } from '../utils/formatters';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectGame: (game: GameItem) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  const remaining = getSaleRemainingText(game.saleEndsAt);
  const scoreStyle = getScoreBadgeStyle(game.score.metacritic);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between">
      {/* 上部：画像 & バッジ群 */}
      <div>
        <div 
          className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
          onClick={() => onSelectGame(game)}
        >
          <img
            src={game.imageUrl}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          />

          {/* 割引率バッジ */}
          <div className="absolute top-2.5 left-2.5 bg-nintendo-red text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
            <span>-{game.discountRate}%</span>
          </div>

          {/* セール終了日バッジ */}
          <div
            className={`absolute top-2.5 right-11 text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm flex items-center gap-1 ${
              remaining.isUrgent
                ? 'bg-rose-500/90 text-white animate-pulse'
                : 'bg-black/60 text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{remaining.text}</span>
          </div>

          {/* お気に入りボタン */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            aria-label="お気に入り登録"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 shadow-md flex items-center justify-center transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-600'
              }`}
            />
          </button>

          {/* 編集部ピックアップバッジ */}
          {game.isEditorChoice && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>殿堂入り名作</span>
            </div>
          )}
        </div>

        {/* コンテンツ本体 */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* タイトル & パブリッシャー */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400 truncate">
                {game.publisher}
              </span>

              {/* 評価スコアバッジ */}
              {game.score.metacritic !== null ? (
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}
                  title={`Metacriticスコア: ${game.score.metacritic}点`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Meta {game.score.metacritic}</span>
                </div>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  評価集計中
                </span>
              )}
            </div>

            <h3
              onClick={() => onSelectGame(game)}
              className="text-base font-bold text-slate-900 group-hover:text-nintendo-red transition-colors line-clamp-1 cursor-pointer"
            >
              {game.title}
            </h3>
          </div>

          {/* ジャンルタグ */}
          <div className="flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* おすすめ一言寸評（吹き出しスタイル） */}
          <div className="relative bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-950/90 leading-relaxed shadow-xs">
            <div className="flex items-start gap-1.5 mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="font-bold text-[11px] text-amber-900">
                おすすめポイント
              </span>
            </div>
            <p className="line-clamp-2 pl-0.5">{game.shortReview}</p>

            {/* おすすめ対象タグ */}
            {game.recommendedFor && game.recommendedFor.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-amber-200/40">
                {game.recommendedFor.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下部：価格 & アクションボタン */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-end justify-between pt-3">
          {/* 価格表示 */}
          <div>
            <div className="text-[11px] text-slate-400 line-through">
              {formatYen(game.regularPrice)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-nintendo-red">
                {formatYen(game.discountPrice)}
              </span>
              <span className="text-[11px] font-bold text-nintendo-red">税込</span>
            </div>
          </div>

          {/* マイニンテンドーストア直接購入リンク */}
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-nintendo-red text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <span>ストアで見る</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
