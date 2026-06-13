# Supabase 마이그레이션 및 시드

이 디렉터리에는 DevLog 블로그용 Supabase 스키마 마이그레이션과 시드 데이터가 포함되어 있습니다.

## 사전 준비

1. [Supabase CLI](https://supabase.com/docs/guides/cli) 설치

```bash
npm install -g supabase
```

2. Supabase 대시보드에서 프로젝트 Reference ID 확인

## 원격 프로젝트에 마이그레이션 적용

`.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`에 연결된 프로젝트에 스키마를 반영합니다.

```bash
# 프로젝트 루트에서 실행
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

- `db push`: `supabase/migrations/` 아래 SQL 파일을 원격 DB에 적용합니다.
- RLS 정책과 테이블이 함께 생성됩니다.

## 시드 데이터 적용

마이그레이션 적용 후 샘플 카테고리·게시글을 넣습니다.

```bash
supabase db seed
```

또는 Supabase SQL Editor에서 `supabase/seed.sql` 내용을 직접 실행해도 됩니다.

## 로컬 Supabase (선택)

로컬에서 Supabase 스택을 띄워 테스트하려면:

```bash
supabase start
supabase db reset   # 마이그레이션 + seed.sql 재적용
```

로컬 anon key와 URL은 `supabase status` 출력값을 `.env.local`에 설정합니다.

## 스키마 요약

| 테이블 | 설명 |
|--------|------|
| `categories` | 카테고리 (Rust, TypeScript 등) |
| `posts` | 블로그 게시글 |

### RLS

| 테이블 | 정책 |
|--------|------|
| `categories` | anon/authenticated 모두 SELECT |
| `posts` SELECT (anon) | `published_at`이 설정·과거인 글만 |
| `posts` SELECT (authenticated) | 발행된 글 + `author_id = auth.uid()`인 본인 글 |
| `posts` INSERT | authenticated, `author_id = auth.uid()`, `is_featured = false` |
| `posts` UPDATE/DELETE | authenticated, 본인 글(`author_id = auth.uid()`)만 |

`posts.author_id`는 Supabase Auth 사용자와 연결됩니다. 시드 데이터는 `author_id`가 NULL일 수 있습니다.
