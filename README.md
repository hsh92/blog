# DevLog

개발자를 위한 문서·블로그 서비스입니다. [Next.js](https://nextjs.org) App Router 기반으로 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)으로 생성되었습니다.

**GitHub 저장소:** https://github.com/hsh92/blog  
**기본 브랜치:** `master`

현재 구현 범위: **홈 페이지(글 목록·필터·페이지네이션)**, **게시글 상세·댓글**, **마크다운 글쓰기(`/write`)**, **이메일 인증(로그인/회원가입)**, UI 디자인 목업(`design/`).

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19, Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Data | Supabase JS SDK (클라이언트 글 목록 조회) |
| Language | TypeScript (strict, `@/*` path alias) |
| Font | Geist / Geist Mono (`app/layout.tsx`) |
| Test | Vitest (`test/`) |

## 환경 변수

`.env.example`을 참고해 `.env` 또는 `.env.local`을 생성합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# 또는 Supabase 신규 대시보드 명칭:
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Supabase 대시보드에서 **Authentication → URL Configuration**에 다음을 등록합니다.

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

## 디렉터리 구조

```
blog/
├── app/
│   ├── auth/
│   │   └── callback/route.ts   # 이메일 인증·비밀번호 재설정 콜백
│   ├── login/
│   │   ├── actions.ts          # 로그인·회원가입 Server Actions
│   │   ├── page.tsx            # 로그인/회원가입 (/login)
│   │   ├── forgot/page.tsx     # 비밀번호 재설정 요청
│   │   └── reset-password/page.tsx
│   ├── write/
│   │   ├── actions.ts          # 게시글 발행 Server Action
│   │   └── page.tsx            # 마크다운 에디터 (/write)
│   ├── posts/[slug]/
│   │   ├── actions.ts          # 좋아요·저장·댓글
│   │   └── page.tsx            # 게시글 상세
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── auth/                   # 인증 UI
│   ├── home/                   # 홈·글 목록 UI
│   ├── post/                   # 게시글 상세 UI
│   ├── write/                  # 마크다운 에디터 UI
│   └── layout/                 # 헤더·푸터
├── lib/
│   ├── auth/                   # 검증·한국어 메시지
│   ├── posts/                  # 글 타입·페이지네이션·훅
│   └── supabase/               # Supabase SSR·브라우저 클라이언트
├── supabase/
│   ├── migrations/             # DB 스키마·RLS
│   ├── seed.sql                # 샘플 카테고리·게시글
│   └── README.md               # 마이그레이션 실행 방법
├── test/                       # Vitest 테스트
├── design/                     # UI 디자인 목업 (PNG)
├── proxy.ts                    # Supabase 세션 갱신 (Next.js 16 Proxy)
└── .env.example
```

### 향후 추가 예정

| 경로 | 용도 |
|------|------|
| `app/` (관리 등) | 게시글 수정·삭제·카테고리 관리 |

## 글쓰기 (`/write`)

로그인한 사용자만 접근할 수 있습니다. 마크다운 에디터와 실시간 미리보기로 작성 후 **발행**하면 Supabase `posts` 테이블에 저장되고 상세 페이지로 이동합니다.

- 비로그인 접근 시 `/login?next=/write`로 리다이렉트
- 헤더 **글쓰기** 링크(로그인 상태)

## Supabase DB 설정

`.env.local`에 Supabase URL·anon key를 설정한 뒤, CLI로 마이그레이션과 시드를 적용합니다. 자세한 명령은 [`supabase/README.md`](supabase/README.md)를 참고하세요.

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push      # 마이그레이션 적용
supabase db seed      # 샘플 데이터 삽입
```

## 인증 기능

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 (기본 탭) |
| `/login?tab=signup` | 회원가입 |
| `/login/forgot` | 비밀번호 재설정 이메일 요청 |
| `/login/reset-password` | 새 비밀번호 설정 (이메일 링크 후) |
| `/auth/callback` | Supabase 이메일 인증 콜백 |

- 이메일·비밀번호 인증만 지원 (소셜 로그인 없음)
- Server Component + Server Actions 중심 구현
- 탭 전환은 URL searchParams (`?tab=signup`)로 처리

## npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | Vitest 테스트 실행 |

## GitHub 워크플로우

이 프로젝트는 Git + GitHub로 버전 관리합니다. `.env` 등 비밀 파일은 커밋하지 않으며, `.env.example`만 저장소에 포함합니다.

### 1. 로컬 Git 초기화 (최초 1회)

`create-next-app` 실행 시 Git 저장소가 함께 생성됩니다. 수동으로 초기화하려면:

```bash
git init
git add .
git commit -m "chore: 프로젝트 초기 커밋"
```

### 2. GitHub 저장소 생성 및 원격 연결

[GitHub CLI](https://cli.github.com/)가 설치되어 있다면:

```bash
# GitHub 로그인 (최초 1회)
gh auth login

# 새 public 저장소 생성 + 원격(origin) 연결 + master 푸시
gh repo create blog --public --source=. --remote=origin --push \
  --description "DevLog - 개발자를 위한 문서·블로그 서비스 (Next.js + Supabase)"
```

이미 GitHub에 저장소가 있고 로컬만 연결할 때:

```bash
git remote add origin https://github.com/hsh92/blog.git
git push -u origin master
```

### 3. 변경사항 저장 (커밋 · 푸시)

작업 후 아래 순서로 GitHub에 반영합니다.

```bash
# 변경 파일 확인
git status
git diff

# 스테이징 (.env는 .gitignore로 자동 제외됨)
git add .

# 커밋 (type prefix 사용: feat, fix, docs, chore 등)
git commit -m "feat: 홈 페이지 카테고리 필터 추가"

# GitHub에 업로드
git push origin master
```

커밋 메시지 예시:

| prefix | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `docs:` | README 등 문서 |
| `test:` | 테스트 추가·수정 |
| `chore:` | 빌드·설정 등 기타 |

### 4. 기능 브랜치 생성 · PR

`master`에 직접 푸시하지 않고 기능 단위로 브랜치를 나눌 때:

```bash
# 최신 master 기준으로 feature 브랜치 생성
git checkout master
git pull origin master
git checkout -b feature/post-write

# 작업 후 커밋
git add .
git commit -m "feat: 글쓰기 페이지 추가"

# 원격에 브랜치 푸시
git push -u origin feature/post-write

# Pull Request 생성 (GitHub CLI)
gh pr create --title "feat: 글쓰기 페이지 추가" --body "## Summary
- 글쓰기 폼 UI
- Supabase posts INSERT 연동

## Test plan
- [ ] 로그인 후 글 작성
- [ ] npm run test
- [ ] npm run build"
```

PR 머지 후 로컬 정리:

```bash
git checkout master
git pull origin master
git branch -d feature/post-write
```

### 5. 커밋에서 제외되는 파일

| 파일/경로 | 이유 |
|-----------|------|
| `.env`, `.env.local` | Supabase 키 등 비밀 정보 |
| `node_modules/` | npm 의존성 (재설치 가능) |
| `.next/` | Next.js 빌드 캐시 |

환경 변수 템플릿은 `.env.example`을 수정·커밋합니다.

### 6. 현재 저장소 이력 요약

| 단계 | 내용 |
|------|------|
| 초기화 | `create-next-app` → `711eb26` Initial commit |
| 기능 구현 | `d354091` feat: DevLog 홈·인증·Supabase 블로그 기능 구현 |
| 원격 저장소 | https://github.com/hsh92/blog (`origin/master`) |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 변경 이력

- **2026-06-13** — `posts.author_id` 및 로그인 사용자 글 생성 RLS 정책 마이그레이션 추가
- **2026-06-13** — 한글 slug 조회 실패 수정 (slug 디코딩·ASCII slug 마이그레이션)
- **2026-06-12** — 글 발행 시 한글 slug redirect 헤더 오류 수정 (클라이언트 네비게이션·ASCII slug)
- **2026-06-12** — 마크다운 에디터·Supabase 발행 글쓰기 페이지(`/write`) 구현
- **2026-06-12** — 게시글 상세 좋아요·저장·댓글 기능 추가 (Supabase engagement 스키마·RLS)
- **2026-06-12** — 디자인 목업 기반 게시글 상세 페이지(제목·저자·썸네일·마크다운 본문·공유) 구현
- **2026-06-12** — 시드/DB featured image Unsplash 404 URL 교체 (`react-19-concurrent-rendering`)
- **2026-06-12** — README에 GitHub 초기화·저장소 생성·커밋·브랜치·PR 워크플로우 문서 추가
- **2026-06-12** — GitHub 저장소 생성 및 master 푸시 (https://github.com/hsh92/blog)
- **2026-06-12** — Supabase `PUBLISHABLE_KEY` 환경 변수명 호환 (`ANON_KEY`와 병행 지원)
- **2026-06-12** — Next.js 16 `middleware.ts` → `proxy.ts` 마이그레이션 (deprecation 경고 제거)
- **2026-06-12** — 디자인 목업 기반 홈 페이지(추천 글·카테고리 필터·글 카드·페이지네이션·푸터), Supabase posts/categories 스키마·RLS·시드 추가
- **2026-06-12** — Supabase Auth 기반 로그인·회원가입·비밀번호 재설정 화면 구현
- **2026-06-12** — README에 프로젝트 소스 구조·기술 스택 문서 추가
