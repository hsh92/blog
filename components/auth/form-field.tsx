import Link from "next/link";

type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: "email" | "password" | "text";
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  labelAction?: React.ReactNode;
  icon?: React.ReactNode;
};

export function FormField({
  id,
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  labelAction,
  icon,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm text-devlog-muted">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-devlog-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full rounded-lg border border-devlog-border bg-devlog-input px-3 py-3 text-sm text-devlog-text placeholder:text-devlog-muted/70 outline-none transition focus:border-devlog-accent focus:ring-1 focus:ring-devlog-accent ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

export function ForgotPasswordLink() {
  return (
    <Link
      href="/login/forgot"
      className="text-xs text-devlog-muted transition hover:text-devlog-accent"
    >
      비밀번호를 잊으셨나요?
    </Link>
  );
}
