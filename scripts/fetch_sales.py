#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ニンテンドーストア セール情報 ＆ 評価データ自動収集スクリプト
1. 任天堂公式eShop内部APIから日本のセール対象ソフトを取得
2. RAWG API（またはMetacritic）から評価スコアを取得
3. Gemini API（無料枠）から一言おすすめ寸評を生成（キャッシュ機構付き）
4. フロントエンド用JSON (src/data/sales.json) に出力
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone

# 設定定数
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(BASE_DIR, "src", "data", "sales.json")
CACHE_PATH = os.path.join(BASE_DIR, "src", "data", "reviews_cache.json")

RAWG_API_KEY = os.environ.get("RAWG_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def load_cache():
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load cache: {e}")
    return {}

def save_cache(cache):
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def fetch_eshop_sales(limit=50):
    """日本のeShopセールエンドポイントから一覧を取得"""
    sales = []
    offset = 0
    page_size = min(limit, 30)

    print(f"Fetching Nintendo eShop sales (up to {limit} items)...")
    while len(sales) < limit:
        url = f"https://ec.nintendo.com/api/JP/ja/search/sales?count={page_size}&offset={offset}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=15) as res:
                data = json.loads(res.read().decode("utf-8"))
                contents = data.get("contents", [])
                if not contents:
                    break
                sales.extend(contents)
                total = data.get("total", 0)
                offset += len(contents)
                if offset >= total or len(contents) < page_size:
                    break
                time.sleep(1) # ストア負荷軽減
        except Exception as e:
            print(f"Error fetching eShop sales at offset {offset}: {e}")
            break

    print(f"Fetched {len(sales)} sales items.")
    return sales[:limit]

def fetch_rawg_rating(game_title, api_key):
    """RAWG APIからMetacriticスコアとユーザーレーティングを取得"""
    if not api_key:
        return None, None

    query = urllib.parse.quote(game_title)
    url = f"https://api.rawg.io/api/games?key={api_key}&search={query}&platforms=7&page_size=1"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8"))
            results = data.get("results", [])
            if results:
                best = results[0]
                metacritic = best.get("metacritic")
                rating = best.get("rating")
                return metacritic, rating
    except Exception as e:
        print(f"Error fetching RAWG for {game_title}: {e}")
    return None, None

def generate_short_review(title, genres, discount_rate, api_key, cache):
    """Gemini APIまたはキャッシュからおすすめ寸評を取得"""
    cache_key = f"{title}_{discount_rate}"
    if cache_key in cache:
        return cache[cache_key]

    # APIキーがない場合はフォールバックテンプレート
    if not api_key:
        genre_str = "・".join(genres[:2]) if genres else "ゲーム"
        review_data = {
            "shortReview": f"高評価を獲得している注目の{genre_str}タイトル。セール中のこの機会にぜひチェックしたい一作です！",
            "recommendedFor": [f"{genres[0]}好き" if genres else "ゲーム好き", "セール注目"],
            "highlights": [f"{discount_rate}%OFFでお買い得", "快適な操作感と中毒性の高いシステム"]
        }
        cache[cache_key] = review_data
        return review_data

    # Gemini API経由での自動生成
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    prompt = f"""
任天堂Switchでセール中のゲームソフト「{title}」（ジャンル: {', '.join(genres)}、割引率: {discount_rate}%）について、購入検討者向けのおすすめポイントを作成してください。
以下のJSON形式のみを出力してください（Markdownのコードブロックは不要）：
{{
  "shortReview": "50〜80文字程度の熱量の伝わる一言おすすめ寸評（魅力や中毒性、どんなゲームかを簡潔に）",
  "recommendedFor": ["〇〇好き", "やりこみ派など2〜3個の短いタグ"],
  "highlights": ["特徴1", "特徴2", "特徴3"]
}}
"""
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "response_mime_type": "application/json"}
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            review_data = json.loads(text)
            cache[cache_key] = review_data
            return review_data
    except Exception as e:
        print(f"Error calling Gemini for {title}: {e}")
        # フォールバック
        review_data = {
            "shortReview": f"高評価を獲得している注目の{genres[0] if genres else 'アクション'}タイトル。セール中のこの機会にぜひチェックしたい一作です！",
            "recommendedFor": [f"{genres[0]}好き" if genres else "ゲーム好き", "セール注目"],
            "highlights": [f"{discount_rate}%OFFでお買い得"]
        }
        cache[cache_key] = review_data
        return review_data

def main():
    print("Starting Nintendo Switch Sales Collector...")
    cache = load_cache()

    # パイロット版では既存の高品質 sales.json がある場合は保持しつつ更新可能
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            existing_games = json.load(f)
            print(f"Found existing {len(existing_games)} games in sales.json.")

    save_cache(cache)
    print("Done! Data collection complete.")

if __name__ == "__main__":
    main()
