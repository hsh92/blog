import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { getAuthStatusMessage } from "@/lib/auth/messages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "로그인 | DevLog",
  description: "DevLog 계정으로 로그인하거나 회원가입하세요.",
};

type LoginPageProps = {
  searchParams: Promise<{
    tab?: string;
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  const activeTab = params.tab === "signup" ? "signup" : "login";
  const statusMessage = getAuthStatusMessage(params.message);
  const errorMessage = params.error;

  return (
    <AuthShell>
      <div className="w-full max-w-md space-y-4">
        {errorMessage ? <AuthAlert message={errorMessage} variant="error" /> : null}
        {statusMessage ? (
          <AuthAlert message={statusMessage} variant="success" />
        ) : null}
        <AuthCard activeTab={activeTab} />
      </div>
    </AuthShell>
  );
}
