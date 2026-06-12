import Link from "next/link";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

type AuthCardProps = {
  activeTab: "login" | "signup";
};

export function AuthCard({ activeTab }: AuthCardProps) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-devlog-border bg-devlog-card shadow-2xl shadow-black/30">
      <div className="px-8 pt-8 text-center">
        <p className="text-2xl font-bold tracking-tight text-devlog-accent">DevLog</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-devlog-muted">
          Developer Documentation Engine
        </p>
      </div>

      <div className="mt-6">
        <AuthTabs activeTab={activeTab} />
      </div>

      <div className="px-8 py-8">
        {activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>

      <p className="border-t border-devlog-border px-8 py-4 text-center text-xs leading-relaxed text-devlog-muted">
        계속 진행하면{" "}
        <Link href="#" className="text-devlog-accent hover:underline">
          서비스 이용약관
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
