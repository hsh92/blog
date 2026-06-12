import Link from "next/link";
import { forgotPasswordAction } from "@/app/login/actions";
import { FormField } from "@/components/auth/form-field";

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

export function ForgotPasswordForm() {
  return (
    <form action={forgotPasswordAction} className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">비밀번호 재설정</h2>
        <p className="text-sm text-devlog-muted">
          가입한 이메일 주소를 입력하면 재설정 링크를 보내 드립니다.
        </p>
      </div>

      <FormField
        id="forgot-email"
        label="이메일 주소"
        name="email"
        type="email"
        placeholder="name@domain.com"
        autoComplete="email"
        icon={<AtIcon />}
      />

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-devlog-accent px-4 py-3 text-sm font-semibold text-devlog-bg transition hover:bg-sky-300"
      >
        재설정 링크 보내기
        <span aria-hidden="true">→</span>
      </button>

      <p className="text-center text-sm text-devlog-muted">
        <Link href="/login" className="text-devlog-accent hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  );
}
