-- 게시글 본문 시드 (상세 페이지 데모용)

UPDATE public.posts
SET content = $markdown$## 동시성 렌더링이란?

React 19에서는 렌더링 작업을 더 작은 단위로 나누어 브라우저가 사용자 입력에 먼저 응답할 수 있도록 합니다. 이전 버전에서도 Concurrent Mode의 실험적 API가 존재했지만, 19 버전부터는 reconciler 레벨에서 기본 동작으로 자리 잡았습니다.

개발자 입장에서 가장 큰 변화는 **Suspense 경계**와 **Server Component**가 하나의 일관된 모델로 통합된다는 점입니다. 클라이언트에서만 해결하던 로딩 상태를 서버와 클라이언트가 나누어 처리할 수 있게 됩니다.

## Server Component와의 관계

App Router 환경에서는 기본적으로 모든 컴포넌트가 서버에서 실행됩니다. 상호작용이 필요한 부분만 `"use client"` 지시어로 클라이언트 경계를 명시하면 됩니다.

```tsx
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  return (
    <article>
      <PostHeader post={post} />
      <PostContent content={post.content} />
    </article>
  );
}
```

위 패턴처럼 데이터 페칭은 서버에서, 공유 버튼처럼 브라우저 API가 필요한 UI만 클라이언트 컴포넌트로 분리하는 것이 권장됩니다.

## 개발자 경험(DX) 변화

- **스트리밍 SSR**: HTML을 점진적으로 전송해 첫 화면 시간을 단축합니다.
- **자동 배칭**: 상태 업데이트가 더 예측 가능하게 묶입니다.
- **Actions**: 폼 제출과 데이터 변경을 선언적으로 처리할 수 있습니다.

## 앞으로의 과제

동시성 렌더링은 성능 이점이 크지만, 디버깅 난이도도 함께 올라갑니다. 팀에서는 Suspense 경계 설계, 에러 바운더리 배치, 캐시 정책을 문서화해 두는 것이 좋습니다.

React 19는 "더 빠른 UI"를 넘어 **서버와 클라이언트의 역할 분리**를 더 명확히 만드는 전환점입니다. 기존 코드베이스를 마이그레이션할 때는 상호작용 단위부터 경계를 그려 나가는 점진적 접근이 가장 안전합니다.$markdown$
WHERE slug = 'react-19-concurrent-rendering';

UPDATE public.posts
SET content = $markdown$## WebAssembly와 Rust

Rust는 메모리 안전성과 네이티브 수준의 성능을 동시에 제공하므로 WASM 타깃으로 컴파일하기에 적합합니다. `wasm-pack`을 사용하면 npm 패키지 형태로 프론트엔드 프로젝트에 통합할 수 있습니다.

## 빌드 파이프라인

```bash
wasm-pack build --target web --out-dir pkg
```

빌드 결과물은 ES 모듈로 import할 수 있으며, Vite나 Next.js 번들러와 함께 사용할 수 있습니다.

## 브라우저에서의 추론

신경망 추론처럼 CPU 집약적인 작업은 메인 스레드를 차단하지 않도록 Web Worker와 함께 배치하는 것이 좋습니다. WASM 모듈을 Worker에 로드하면 UI 응답성을 유지하면서 연산을 offload할 수 있습니다.

## 성능 벤치마킹

런타임별(wasmtime, wasmer 등) 실행 시간 차이는 워크로드에 따라 크게 달라집니다. 프로덕션 배포 전에는 실제 데이터 크기와 동일한 조건에서 측정하는 것이 중요합니다.$markdown$
WHERE slug = 'rust-wasm-frontend';
