import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "새 비밀번호 설정 | DevLog",
  description: "DevLog 새 비밀번호 설정",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=인증 세션이 만료되었습니다. 다시 시도해 주세요.");
  }

  const params = await searchParams;

  return (
    <AuthShell>
      <div className="w-full max-w-md space-y-4">
        {params.error ? <AuthAlert message={params.error} variant="error" /> : null}
        <div className="overflow-hidden rounded-xl border border-devlog-border bg-devlog-card px-8 py-8 shadow-2xl shadow-black/30">
          <ResetPasswordForm />
        </div>
      </div>
    </AuthShell>
  );
}
