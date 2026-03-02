"""AI書類下書き生成サービス（OpenAI API使用）."""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import settings
from app.models.company import Company
from app.models.draft_document import DraftDocument
from app.models.match_result import MatchResult
from app.models.subsidy import Subsidy


def _build_prompt(company: Company, subsidy: Subsidy, doc_type: str) -> str:
    """書類生成用プロンプトを構築."""
    return f"""あなたは補助金申請の専門家です。以下の情報に基づいて、{doc_type}の下書きを作成してください。

## 企業情報
- 企業名: {company.company_name}
- 業種: {company.industry}
- 従業員数: {company.employee_count}名
- 年間売上: {f'{company.annual_revenue:,}円' if company.annual_revenue else '不明'}
- 資本金: {f'{company.capital:,}円' if company.capital else '不明'}
- 設立年: {company.established_year or '不明'}
- 所在地: {company.prefecture} {company.city or ''}
- 投資目的: {company.investment_purpose or '不明'}
- 想定投資額: {f'{company.investment_amount:,}円' if company.investment_amount else '不明'}

## 補助金情報
- 補助金名: {subsidy.name}
- カテゴリ: {subsidy.category}
- 補助率: {subsidy.subsidy_rate or '不明'}
- 最大補助額: {f'{subsidy.max_amount:,}円' if subsidy.max_amount else '不明'}

## 注意事項
- これは下書きであり、行政書士による最終確認・修正が必要です
- 具体的な数値や事実に基づいた記載を心がけてください
- 採択に向けたポイントを押さえた内容にしてください

JSON形式で以下の構造で出力してください:
{{
  "title": "書類タイトル",
  "sections": [
    {{"heading": "セクション見出し", "content": "本文"}},
    ...
  ],
  "notes": "行政書士への申し送り事項"
}}"""


async def generate_document(
    db: AsyncSession,
    match_result_id: uuid.UUID,
    doc_type: str = "事業計画書",
) -> DraftDocument:
    """AI書類下書きを生成する.

    OpenAI APIキーが未設定の場合はプレースホルダーを返す。
    """
    # マッチ結果と関連データ取得
    match_result = await db.get(MatchResult, match_result_id)
    if not match_result:
        raise ValueError(f"MatchResult not found: {match_result_id}")

    company = await db.get(Company, match_result.company_id)
    subsidy = await db.get(Subsidy, match_result.subsidy_id)

    prompt = _build_prompt(company, subsidy, doc_type)
    ai_model = "gpt-4o"

    # OpenAI API呼び出し（キーが設定されている場合）
    if settings.openai_api_key:
        import json

        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.chat.completions.create(
            model=ai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        content = json.loads(response.choices[0].message.content)
    else:
        # プレースホルダー（デモ・テスト用）
        ai_model = "placeholder"
        content = {
            "title": f"{doc_type} - {subsidy.name}",
            "sections": [
                {
                    "heading": "事業概要",
                    "content": f"{company.company_name}は{company.industry}を営む企業として、"
                               f"{subsidy.name}を活用し事業の成長を図ります。",
                },
                {
                    "heading": "投資計画",
                    "content": f"想定投資額: {company.investment_amount:,}円" if company.investment_amount else "投資額は別途検討",
                },
            ],
            "notes": "本書類はAI生成の下書きです。行政書士による確認・修正が必要です。",
        }

    draft = DraftDocument(
        match_result_id=match_result_id,
        document_type=doc_type,
        content=content,
        ai_model=ai_model,
        generation_prompt=prompt,
    )
    db.add(draft)
    await db.commit()
    await db.refresh(draft)

    return draft
