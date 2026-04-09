# zlog

이무진(zkzkzhzj)의 블로그

## URL

https://zlog.page

## 기술 스택

- Astro v6 + TypeScript
- TailwindCSS v4
- MDX (블로그 글)
- Pagefind (정적 검색)
- satori + sharp (OG 이미지 자동 생성)

## 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `pnpm install` | 의존성 설치 |
| `pnpm dev` | 로컬 개발 서버 (`localhost:4321`) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm run deploy` | 빌드 + GitHub Pages 배포 |
| `pnpm format` | Prettier 포맷팅 |

## 브랜치 전략

- `develop` — 소스 코드 작업
- `main` — 빌드 결과물 (gh-pages가 자동 push)

## 외부 서비스 설정

### 도메인
- Cloudflare에서 `zlog.page` 구매
- Cloudflare DNS에 GitHub Pages A 레코드 4개 등록 (185.199.108~111.153)
- GitHub Pages Custom domain에 `zlog.page` 설정

### 검색엔진
- Google Search Console — `zlog.page` 등록, sitemap 제출 (`/sitemap-index.xml`)
- Naver Search Advisor — `zlog.page` 등록, sitemap + RSS 제출 (`/rss.xml`)

### 분석
- Google Analytics

### 댓글
- giscus — GitHub Discussions 기반, `General` 카테고리 사용
- giscus GitHub App이 `zkzkzhzj/zlog` 레포에 설치되어 있어야 함
