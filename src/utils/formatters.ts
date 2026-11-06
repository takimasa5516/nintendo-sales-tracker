// 日本円フォーマット
export function formatYen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

// セール終了日までの残り日数・時間の計算
export function getSaleRemainingText(saleEndsAt: string): { text: string; isUrgent: boolean } {
  const now = new Date().getTime();
  const end = new Date(saleEndsAt).getTime();
  const diffMs = end - now;

  if (diffMs <= 0) {
    return { text: 'セール終了', isUrgent: true };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return {
      text: `あと${diffDays}日`,
      isUrgent: diffDays <= 2,
    };
  }

  return {
    text: `あと${diffHours}時間`,
    isUrgent: true,
  };
}

// Metacriticスコアのバッジスタイル
export function getScoreBadgeStyle(score: number | null): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score === null) {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      label: 'スコア集計中',
    };
  }

  if (score >= 90) {
    return {
      bg: 'bg-amber-500',
      text: 'text-white font-black',
      border: 'border-amber-400 ring-2 ring-amber-200',
      label: '圧倒的名作',
    };
  }

  if (score >= 80) {
    return {
      bg: 'bg-emerald-600',
      text: 'text-white font-bold',
      border: 'border-emerald-500',
      label: '大絶賛',
    };
  }

  if (score >= 70) {
    return {
      bg: 'bg-teal-600',
      text: 'text-white font-medium',
      border: 'border-teal-500',
      label: '良作',
    };
  }

  return {
    bg: 'bg-slate-500',
    text: 'text-white font-normal',
    border: 'border-slate-400',
    label: '賛否両論',
  };
}
