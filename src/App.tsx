import React, { useState, useMemo, useEffect } from 'react';
import initialGamesData from './data/sales.json';
import { GameItem, SortOption, PriceFilter } from './types/game';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { SortBar } from './components/SortBar';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { Frown, Flame } from 'lucide-react';

export const App: React.FC = () => {
  const games = initialGamesData as GameItem[];

  // 状態管理
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<PriceFilter>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('score_desc');
  const [editorChoiceOnly, setEditorChoiceOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  // お気に入り（LocalStorage永続化）
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('switch_sales_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('switch_sales_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 全ジャンルの一覧（重複なし）
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => g.genres.forEach((genre) => set.add(genre)));
    return Array.from(set);
  }, [games]);

  // フィルタリング処理
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // 検索フィルター
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchPub = game.publisher.toLowerCase().includes(q);
        const matchGenre = game.genres.some((g) => g.toLowerCase().includes(q));
        const matchReview = game.shortReview.toLowerCase().includes(q);
        if (!matchTitle && !matchPub && !matchGenre && !matchReview) {
          return false;
        }
      }

      // ジャンルフィルター
      if (selectedGenre !== 'all' && !game.genres.includes(selectedGenre)) {
        return false;
      }

      // 価格帯フィルター
      if (selectedPriceFilter === 'under_500' && game.discountPrice > 500) return false;
      if (selectedPriceFilter === 'under_1000' && game.discountPrice > 1000) return false;
      if (selectedPriceFilter === 'under_2000' && game.discountPrice > 2000) return false;
      if (selectedPriceFilter === 'under_3000' && game.discountPrice > 3000) return false;

      // 編集部おすすめフィルター
      if (editorChoiceOnly && !game.isEditorChoice) {
        return false;
      }

      // お気に入りフィルター
      if (showFavoritesOnly && !favorites.includes(game.id)) {
        return false;
      }

      return true;
    });
  }, [
    games,
    searchQuery,
    selectedGenre,
    selectedPriceFilter,
    editorChoiceOnly,
    showFavoritesOnly,
    favorites,
  ]);

  // ソート処理
  const sortedGames = useMemo(() => {
    const list = [...filteredGames];
    return list.sort((a, b) => {
      switch (currentSort) {
        case 'score_desc': {
          // 評価スコア（Metacritic）が高い順。nullは末尾
          const scoreA = a.score.metacritic ?? -1;
          const scoreB = b.score.metacritic ?? -1;
          if (scoreB !== scoreA) return scoreB - scoreA;
          // スコアが同点の場合は割引率が高い順
          return b.discountRate - a.discountRate;
        }
        case 'discount_desc':
          return b.discountRate - a.discountRate;
        case 'price_asc':
          return a.discountPrice - b.discountPrice;
        case 'price_desc':
          return b.discountPrice - a.discountPrice;
        case 'ends_soon': {
          const timeA = new Date(a.saleEndsAt).getTime();
          const timeB = new Date(b.saleEndsAt).getTime();
          return timeA - timeB;
        }
        default:
          return 0;
      }
    });
  }, [filteredGames, currentSort]);

  // フィルターが適用されているか
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedGenre !== 'all' ||
    selectedPriceFilter !== 'all' ||
    editorChoiceOnly ||
    showFavoritesOnly
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedPriceFilter('all');
    setEditorChoiceOnly(false);
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ナビゲーションバー */}
      <Navbar
        favoriteCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        totalGamesCount={games.length}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ヒーローバナー（キャッチコピー） */}
        <div className="mb-6 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-red-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nintendo-red text-white text-xs font-black shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>いま買い時の名作セール速報</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Metacritic高評価ソフトから選ぶ、<br className="hidden sm:inline" />
              失敗しないSwitchセール情報
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              「安くなっているけど本当に面白いの？」を一発解決。世界的な批評家レビュー（Metacritic）90点超えの殿堂入りタイトルから、おすすめの一言寸評付きで厳選掲載中。
            </p>
          </div>
        </div>

        {/* フィルター・検索バー */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          availableGenres={availableGenres}
          selectedPriceFilter={selectedPriceFilter}
          onSelectPriceFilter={setSelectedPriceFilter}
          editorChoiceOnly={editorChoiceOnly}
          onToggleEditorChoice={() => setEditorChoiceOnly(!editorChoiceOnly)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* ソート & 件数表示 */}
        <SortBar
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          resultCount={sortedGames.length}
        />

        {/* ゲーム一覧カードグリッド */}
        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {sortedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
                onSelectGame={setSelectedGame}
              />
            ))}
          </div>
        ) : (
          /* 検索結果ゼロの空状態 */
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <Frown className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                該当するセールソフトが見つかりませんでした
              </h3>
              <p className="text-xs text-slate-500">
                検索キーワードや絞り込み条件を変更して再度お試しください。
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              <span>絞り込みをすべてリセット</span>
            </button>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 mt-12 space-y-2">
        <p className="font-medium">
          Nintendo SwitchおよびMy Nintendo Storeは任天堂株式会社の登録商標です。<br />
          本サイトは非公式のファンメイドセール情報まとめツールであり、任天堂株式会社とは一切関係ありません。
        </p>
        <p className="text-[11px] text-slate-400">
          価格やセール期間は変動する場合があります。ご購入の際は必ずニンテンドーストア公式ページで最終価格をご確認ください。
        </p>
      </footer>

      {/* 詳細モーダル */}
      <GameDetailModal
        game={selectedGame}
        isOpen={Boolean(selectedGame)}
        onClose={() => setSelectedGame(null)}
        isFavorite={Boolean(selectedGame && favorites.includes(selectedGame.id))}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default App;
