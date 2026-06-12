import { loginAction } from "@/app/login/actions";
import { ForgotPasswordLink, FormField } from "@/components/auth/form-field";

function AtIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginForm() {
  return (
    <form action={loginAction} className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">환영합니다</h2>
        <p className="text-sm text-devlog-muted">기술 여정을 계속해 보세요.</p>
      </div>

      <FormField
        id="login-email"
        label="이메일 주소"
        name="email"
        type="email"
        placeholder="name@domain.com"
        autoComplete="email"
        icon={<AtIcon />}
      />

      <FormField
        id="login-password"
        label="비밀번호"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        labelAction={<ForgotPasswordLink />}
        icon={<LockIcon />}
      />

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-devlog-accent px-4 py-3 text-sm font-semibold text-devlog-bg transition hover:bg-sky-300"
      >
        로그인
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
