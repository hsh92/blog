# DevLog

개발자를 위한 문서·블로그 서비스입니다. [Next.js](https://nextjs.org) App Router 기반으로 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)으로 생성되었습니다.

현재 구현 범위: **홈 페이지(글 목록·필터·페이지네이션)**, **이메일 인증(로그인/회원가입)**, UI 디자인 목업(`design/`).

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
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── auth/                   # 인증 UI (Server Component)
│   ├── home/                   # 홈·글 목록 UI
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
| `app/` (글쓰기 등) | 블로그 작성·관리 기능 |

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

- **2026-06-12** — Supabase env 클라이언트 번들 인라인 수정 (동적 `process.env` 접근 제거)
- **2026-06-12** — Supabase `PUBLISHABLE_KEY` 환경 변수명 호환 (`ANON_KEY`와 병행 지원)
- **2026-06-12** — Next.js 16 `middleware.ts` → `proxy.ts` 마이그레이션 (deprecation 경고 제거)
- **2026-06-12** — 디자인 목업 기반 홈 페이지(추천 글·카테고리 필터·글 카드·페이지네이션·푸터), Supabase posts/categories 스키마·RLS·시드 추가
- **2026-06-12** — Supabase Auth 기반 로그인·회원가입·비밀번호 재설정 화면 구현
- **2026-06-12** — README에 프로젝트 소스 구조·기술 스택 문서 추가
