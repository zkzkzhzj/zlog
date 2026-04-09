# CLAUDE.md

Claude Code가 이 프로젝트를 작업할 때 참조하는 가이드입니다.

## 프로젝트 목적

**zlog**는 단순한 블로그가 아닙니다. 재밌어 보이는 기술이나 아이디어를 직접 실험해보는 공간이자, 그 과정과 생각을 글로 남기는 개인 블로그입니다. 기능이나 UI는 지속적으로 개선되고 새로운 것들이 추가됩니다. 작업 시 "이게 왜 있지?" 싶은 실험적인 코드가 있을 수 있으며, 그건 의도적인 겁니다.

- 프로덕션 URL: https://zlog.page
- 레포지토리: https://github.com/zkzkzhzj/zlog

## 기술 스택

| 영역 | 기술 |
| :--- | :--- |
| 프레임워크 | Astro v6 + TypeScript |
| 스타일 | TailwindCSS v4 (Vite 플러그인 방식) |
| 콘텐츠 | MDX (Content Collections, glob loader) |
| 검색 | Pagefind (정적 인덱싱, 빌드 후 생성) |
| OG 이미지 | satori + sharp (빌드 시 자동 생성) |
| 댓글 | giscus (GitHub Discussions 기반) |
| 패키지 매니저 | pnpm |

## 개발 명령어

```bash
pnpm install          # 의존성 설치 (Node >= 22.12.0 필요)
pnpm dev              # 개발 서버 (localhost:4321) — Pagefind 검색 비활성
pnpm build            # 프로덕션 빌드 + Pagefind 인덱싱
pnpm preview          # 빌드 결과물 로컬 미리보기 (검색 포함)
pnpm deploy           # 빌드 + dist를 main 브랜치에 gh-pages 배포
pnpm format           # Prettier 포맷팅
```

> **주의**: `pnpm dev`에서는 Pagefind 검색이 동작하지 않습니다. 검색을 테스트하려면 `pnpm build && pnpm preview`를 사용하세요.

## 프로젝트 구조

```
src/
├── assets/fonts/         # Pretendard 폰트 (OG 이미지 렌더링용)
├── components/
│   └── Comments.astro    # giscus 댓글 컴포넌트
├── content/
│   └── blog/             # MDX 블로그 글
├── layouts/
│   ├── BaseLayout.astro  # 공통 레이아웃 (head, GA, nav, footer)
│   └── BlogPostLayout.astro  # 글 레이아웃 (ToC, 읽기 시간, 댓글)
├── pages/
│   ├── index.astro       # Info 페이지 (홈)
│   ├── blog/             # 블로그 목록 + 동적 슬러그
│   ├── og/[...slug].png.ts  # OG 이미지 동적 생성
│   └── rss.xml.ts        # RSS 피드
├── plugins/
│   └── remark-separator.ts  # `:::` → 구분선 변환 플러그인
├── styles/
│   └── global.css        # 전역 스타일 (prose, separator 등)
└── content.config.ts     # Content Collections 스키마
```

## 블로그 글 작성

파일 위치: `src/content/blog/*.mdx`

```mdx
---
title: "글 제목"           # 필수
pubDate: 2026-01-01        # 필수
description: "한 줄 요약"  # 선택 (OG description, 목록에 표시)
updatedDate: 2026-01-15    # 선택
tags: ["태그1", "태그2"]   # 선택
draft: true                # 선택 (기본 false, true면 빌드에서 제외)
---
```

- `:::` 를 단독 줄에 쓰면 `···` 구분선으로 변환됩니다 (remark-separator 플러그인)
- 코드 블록에서 `// [!code highlight]`, `// [!code ++]`, `// [!code --]` 주석으로 강조/diff 표시 가능 (shiki transformers)

## 아키텍처 메모

- **OG 이미지**: `src/pages/og/[...slug].png.ts`에서 satori로 SVG 생성 → sharp로 PNG 변환. 글 제목과 "zlog" 텍스트만 표시. 폰트는 `src/assets/fonts/Pretendard-Regular.woff` 사용.
- **ToC**: `BlogPostLayout.astro`에서 depth <= 3 헤딩만 추출. 1280px 이상에서 우측 고정 사이드바로 표시.
- **외부 서비스 키**: GA 측정 ID, Search Console 인증 메타태그, giscus repo/category ID 등은 각각 `BaseLayout.astro`, `Comments.astro`에 직접 설정되어 있습니다.

## 브랜치 전략

- `develop` — 소스 코드. 모든 작업은 이 브랜치에서.
- `main` — `pnpm deploy` 실행 시 gh-pages가 빌드 결과물을 자동 push. **직접 수정 금지.**

## 코딩 컨벤션

- TypeScript strict 모드
- Prettier 포맷팅 (`.prettierrc` 참조)
- Astro 컴포넌트의 스타일은 TailwindCSS 유틸리티 클래스 우선, 전역 스타일은 `global.css`
- 새 페이지/기능 추가 시 `pnpm build`로 빌드 오류 확인 후 PR
