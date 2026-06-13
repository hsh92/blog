"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { translateAuthError } from "@/lib/auth/messages";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import {
  validateEmail,
  validateLoginInput,
  validatePassword,
  validatePasswordConfirmation,
  validateSignupInput,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

function buildLoginRedirect(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return query ? `/login?${query}` : "/login";
}

async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = getSafeRedirectPath(String(formData.get("next") ?? ""));

  const validation = validateLoginInput(email, password);
  if (!validation.valid) {
    redirect(
      buildLoginRedirect({
        tab: "login",
        error: validation.message,
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    redirect(
      buildLoginRedirect({
        tab: "login",
        error: translateAuthError(error.message),
      }),
    );
  }

  redirect(next);
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const validation = validateSignupInput(email, password, confirmPassword);
  if (!validation.valid) {
    redirect(
      buildLoginRedirect({
        tab: "signup",
        error: validation.message,
      }),
    );
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(
      buildLoginRedirect({
        tab: "signup",
        error: translateAuthError(error.message),
      }),
    );
  }

  redirect(buildLoginRedirect({ tab: "login", message: "confirm_email" }));
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");

  const validation = validateEmail(email);
  if (!validation.valid) {
    redirect(`/login/forgot?error=${encodeURIComponent(validation.message)}`);
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/auth/callback?next=/login/reset-password`,
  });

  if (error) {
    redirect(
      `/login/forgot?error=${encodeURIComponent(translateAuthError(error.message))}`,
    );
  }

  redirect("/login/forgot?message=reset_email_sent");
}

export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    redirect(
      `/login/reset-password?error=${encodeURIComponent(passwordValidation.message)}`,
    );
  }

  const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
  if (!confirmValidation.valid) {
    redirect(
      `/login/reset-password?error=${encodeURIComponent(confirmValidation.message)}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=인증 세션이 만료되었습니다. 다시 시도해 주세요.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `/login/reset-password?error=${encodeURIComponent(translateAuthError(error.message))}`,
    );
  }

  await supabase.auth.signOut();
  redirect(buildLoginRedirect({ message: "password_updated" }));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
