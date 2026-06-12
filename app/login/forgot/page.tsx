import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getAuthStatusMessage } from "@/lib/auth/messages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "비밀번호 재설정 | DevLog",
  description: "DevLog 계정 비밀번호 재설정",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  const statusMessage = getAuthStatusMessage(params.message);
  const errorMessage = params.error;

  return (
    <AuthShell>
      <div className="w-full max-w-md space-y-4">
        {errorMessage ? <AuthAlert message={errorMessage} variant="error" /> : null}
        {statusMessage ? (
          <AuthAlert message={statusMessage} variant="success" />
        ) : null}
        <div className="overflow-hidden rounded-xl border border-devlog-border bg-devlog-card px-8 py-8 shadow-2xl shadow-black/30">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthShell>
  );
}
