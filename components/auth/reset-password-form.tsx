import Link from "next/link";
import { resetPasswordAction } from "@/app/login/actions";
import { FormField } from "@/components/auth/form-field";

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

export function ResetPasswordForm() {
  return (
    <form action={resetPasswordAction} className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">새 비밀번호 설정</h2>
        <p className="text-sm text-devlog-muted">
          사용할 새 비밀번호를 입력해 주세요.
        </p>
      </div>

      <FormField
        id="reset-password"
        label="새 비밀번호"
        name="password"
        type="password"
        placeholder="8자 이상 입력"
        autoComplete="new-password"
        icon={<LockIcon />}
      />

      <FormField
        id="reset-confirm-password"
        label="비밀번호 확인"
        name="confirmPassword"
        type="password"
        placeholder="비밀번호를 다시 입력"
        autoComplete="new-password"
        icon={<LockIcon />}
      />

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-devlog-accent px-4 py-3 text-sm font-semibold text-devlog-bg transition hover:bg-sky-300"
      >
        비밀번호 변경
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
