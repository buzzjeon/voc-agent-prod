#!/bin/bash
# VOC Agent GitHub 푸시 스크립트

echo "🚀 VOC Agent GitHub 푸시 시작..."
echo ""

# 1. Frontend submodule 문제 해결
echo "1️⃣ Frontend submodule 제거 중..."
rm -rf frontend/.git
git rm --cached frontend 2>/dev/null || true
git add frontend

# 2. 변경사항 커밋
echo "2️⃣ Frontend 변경사항 커밋 중..."
git commit -m "Convert frontend from submodule to regular directory

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" 2>/dev/null || echo "No changes to commit"

# 3. 원격 저장소 URL 입력 받기
echo ""
echo "3️⃣ GitHub 저장소 URL을 입력하세요:"
echo "   예: https://github.com/YOUR_USERNAME/voc-agent-prod.git"
echo "   또는: git@github.com:YOUR_USERNAME/voc-agent-prod.git"
read -p "URL: " REPO_URL

# 4. 원격 저장소 추가
echo ""
echo "4️⃣ 원격 저장소 추가 중..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# 5. 브랜치 설정
echo "5️⃣ 브랜치를 main으로 설정 중..."
git branch -M main

# 6. 푸시
echo "6️⃣ GitHub에 푸시 중..."
git push -u origin main

echo ""
echo "✅ 완료! GitHub 저장소를 확인하세요."
