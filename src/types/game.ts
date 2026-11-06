export type ReviewTier = 'legendary' | 'masterpiece' | 'great' | 'good' | 'unrated';

export interface GameScore {
  metacritic: number | null; // 0 - 100
  userScore?: number | null; // 0 - 10
  steamPositiveRate?: number | null; // 0 - 100 (%)
  tier: ReviewTier;
}

export interface GameItem {
  id: string; // NSUID
  title: string;
  publisher: string;
  genres: string[];
  imageUrl: string;
  regularPrice: number;
  discountPrice: number;
  discountRate: number; // 例: 50 (%)
  saleEndsAt: string; // ISO 8601 文字列 (例: 2026-11-20T23:59:59+09:00)
  storeUrl: string;
  score: GameScore;
  shortReview: string; // 一言寸評（おすすめポイント）
  recommendedFor: string[]; // 例: ["ローグライク好き", "高難易度", "探索"]
  highlights?: string[]; // 特徴
  isEditorChoice?: boolean; // 編集部・注目作フラグ
}

export type SortOption = 
  | 'score_desc' // 評価が高い順
  | 'discount_desc' // 割引率が高い順
  | 'price_asc' // 価格が安い順
  | 'price_desc' // 価格が高い順
  | 'ends_soon'; // セール終了が近い順

export type PriceFilter = 'all' | 'under_500' | 'under_1000' | 'under_2000' | 'under_3000';
