# Agentic QA OS

에이전트 기반 QA 워크플로우를 소개하는 React + Vite + Tailwind UI 데모입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

GitHub Pages용 빌드(자산 경로 `/Agentic-QA-OS/`):

```bash
GITHUB_PAGES=true npm run build
```

## GitHub

원격 저장소: [https://github.com/queenlynda1223-max/Agentic-QA-OS](https://github.com/queenlynda1223-max/Agentic-QA-OS)

## 웹에서 보기 (GitHub Pages)

**라이브 URL:** [https://queenlynda1223-max.github.io/Agentic-QA-OS/](https://queenlynda1223-max.github.io/Agentic-QA-OS/)

### 1) 코드 푸시

`vite.config.ts` 등은 일반 `git push`로 올릴 수 있습니다.

### 2) GitHub Actions 워크플로 (OAuth `workflow` 오류가 날 때)

로컬에서 `.github/workflows/*.yml`을 푸시하면, 사용 중인 Git 자격 증명(예: Cursor/구버전 GitHub 앱)에 **`workflow` 범위**가 없으면 거절될 수 있습니다.

**해결 A — 권한 추가 후 푸시 (권장)**

- [GitHub CLI](https://cli.github.com/) 사용 시:

  ```bash
  gh auth refresh -s workflow
  git push origin main
  ```

- PAT(토큰) 사용 시: [Fine-grained 또는 classic PAT](https://github.com/settings/tokens)에 **Contents**와 **Workflows**(또는 classic의 `workflow`) 권한을 켠 뒤, 그 토큰으로 다시 인증합니다.

**해결 B — 브라우저에서 워크플로만 만들기**

저장소에서 **Add file → Create new file** 로 아래 경로를 만듭니다.

- 경로: `.github/workflows/deploy-pages.yml`
- 내용은 아래 블록 전체를 붙여넣고 **Commit** 합니다.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_PAGES: 'true'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 3) Pages 설정

1. **Settings → Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. **Actions** 탭에서 워크플로가 성공하면 위 라이브 URL로 접속합니다.

## 기타 배포

[Vercel](https://vercel.com) 또는 [Netlify](https://netlify.com)에서도 연결 가능합니다. (Vite, `npm run build`, 출력 디렉터리 `dist`)
