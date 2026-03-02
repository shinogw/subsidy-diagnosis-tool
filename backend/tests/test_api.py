"""Tests for API endpoints using the async test client."""
from __future__ import annotations

import uuid

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.match_result import MatchResult
from app.models.subsidy import Subsidy


pytestmark = pytest.mark.asyncio


class TestHealth:
    async def test_health_check(self, client: AsyncClient):
        resp = await client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}


class TestSubsidies:
    async def test_list_empty(self, client: AsyncClient):
        resp = await client.get("/api/v1/subsidies")
        assert resp.status_code == 200
        assert resp.json() == []

    async def test_create_subsidy(self, client: AsyncClient):
        payload = {
            "name": "テスト補助金",
            "category": "IT導入",
            "provider": "テスト省庁",
            "difficulty_rank": "A",
            "status": "active",
        }
        resp = await client.post("/api/v1/subsidies", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "テスト補助金"
        assert data["category"] == "IT導入"
        assert data["difficulty_rank"] == "A"
        assert "id" in data

    async def test_get_subsidy(self, client: AsyncClient, sample_subsidy: Subsidy):
        resp = await client.get(f"/api/v1/subsidies/{sample_subsidy.id}")
        assert resp.status_code == 200
        assert resp.json()["name"] == sample_subsidy.name

    async def test_get_subsidy_not_found(self, client: AsyncClient):
        fake_id = uuid.uuid4()
        resp = await client.get(f"/api/v1/subsidies/{fake_id}")
        assert resp.status_code == 404

    async def test_update_subsidy(self, client: AsyncClient, sample_subsidy: Subsidy):
        payload = {
            "name": "更新済み補助金",
            "category": "IT導入",
            "provider": "テスト省庁",
            "difficulty_rank": "B",
        }
        resp = await client.put(f"/api/v1/subsidies/{sample_subsidy.id}", json=payload)
        assert resp.status_code == 200
        assert resp.json()["name"] == "更新済み補助金"
        assert resp.json()["difficulty_rank"] == "B"

    async def test_list_with_filter(self, client: AsyncClient, sample_subsidy: Subsidy):
        resp = await client.get("/api/v1/subsidies?status=active")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert all(s["status"] == "active" for s in data)


class TestDiagnosis:
    async def test_create_diagnosis(self, client: AsyncClient, sample_subsidy: Subsidy):
        payload = {
            "company_name": "診断テスト株式会社",
            "industry": "情報通信業",
            "employee_count": 20,
            "prefecture": "東京都",
            "capital": 10000000,
            "has_gbiz_id": True,
            "investment_purpose": "IT システム導入でDX推進",
            "investment_amount": 3000000,
        }
        resp = await client.post("/api/v1/diagnosis", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "company_id" in data
        assert "matches" in data
        assert len(data["matches"]) >= 1

        match = data["matches"][0]
        assert 1 <= match["fit_score"] <= 5
        assert match["difficulty_rank"] in ("A", "B", "C")
        assert match["subsidy_name"] is not None

    async def test_get_diagnosis_results(
        self, client: AsyncClient, sample_subsidy: Subsidy
    ):
        # First create a diagnosis
        payload = {
            "company_name": "結果取得テスト株式会社",
            "industry": "製造業",
            "employee_count": 50,
            "prefecture": "東京都",
            "investment_purpose": "設備導入",
            "investment_amount": 2000000,
        }
        create_resp = await client.post("/api/v1/diagnosis", json=payload)
        assert create_resp.status_code == 200
        company_id = create_resp.json()["company_id"]

        # Then retrieve results
        resp = await client.get(f"/api/v1/diagnosis/{company_id}/results")
        assert resp.status_code == 200
        data = resp.json()
        assert data["company_id"] == company_id
        assert len(data["matches"]) >= 1

    async def test_get_diagnosis_not_found(self, client: AsyncClient):
        fake_id = uuid.uuid4()
        resp = await client.get(f"/api/v1/diagnosis/{fake_id}/results")
        assert resp.status_code == 404


class TestDocuments:
    async def test_generate_document(self, client: AsyncClient, sample_subsidy: Subsidy):
        # Create a diagnosis first
        payload = {
            "company_name": "書類テスト株式会社",
            "industry": "情報通信業",
            "employee_count": 10,
            "prefecture": "東京都",
            "investment_purpose": "ITシステム導入",
            "investment_amount": 2000000,
        }
        diag_resp = await client.post("/api/v1/diagnosis", json=payload)
        assert diag_resp.status_code == 200
        match_id = diag_resp.json()["matches"][0]["id"]

        # Generate document
        doc_resp = await client.post(
            "/api/v1/documents/generate",
            json={"match_result_id": match_id, "document_type": "事業計画書"},
        )
        assert doc_resp.status_code == 201
        doc = doc_resp.json()
        assert doc["document_type"] == "事業計画書"
        assert "content" in doc
        assert doc["review_status"] == "draft"

        # Retrieve document
        get_resp = await client.get(f"/api/v1/documents/{doc['id']}")
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == doc["id"]

    async def test_update_review_status(
        self, client: AsyncClient, sample_subsidy: Subsidy
    ):
        # Create diagnosis + document
        payload = {
            "company_name": "レビューテスト株式会社",
            "industry": "情報通信業",
            "employee_count": 10,
            "prefecture": "東京都",
            "investment_purpose": "ITシステム",
            "investment_amount": 1000000,
        }
        diag_resp = await client.post("/api/v1/diagnosis", json=payload)
        match_id = diag_resp.json()["matches"][0]["id"]

        doc_resp = await client.post(
            "/api/v1/documents/generate",
            json={"match_result_id": match_id},
        )
        doc_id = doc_resp.json()["id"]

        # Update review status
        review_resp = await client.patch(
            f"/api/v1/documents/{doc_id}/review",
            json={"review_status": "reviewing", "reviewer_notes": "確認中です"},
        )
        assert review_resp.status_code == 200
        assert review_resp.json()["review_status"] == "reviewing"
        assert review_resp.json()["reviewer_notes"] == "確認中です"

    async def test_document_not_found(self, client: AsyncClient):
        fake_id = uuid.uuid4()
        resp = await client.get(f"/api/v1/documents/{fake_id}")
        assert resp.status_code == 404


class TestStats:
    async def test_stats_empty(self, client: AsyncClient):
        resp = await client.get("/api/v1/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "total_subsidies" in data
        assert "active_subsidies" in data
        assert "total_companies" in data
        assert "total_diagnoses" in data

    async def test_stats_with_data(self, client: AsyncClient, sample_subsidy: Subsidy):
        resp = await client.get("/api/v1/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_subsidies"] >= 1
        assert data["active_subsidies"] >= 1
