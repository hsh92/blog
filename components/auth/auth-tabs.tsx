import Link from "next/link";

type AuthTab = "login" | "signup";

type AuthTabsProps = {
  activeTab: AuthTab;
};

export function AuthTabs({ activeTab }: AuthTabsProps) {
  const tabs: { id: AuthTab; label: string }[] = [
    { id: "login", label: "로그인" },
    { id: "signup", label: "회원가입" },
  ];

  return (
    <div className="grid grid-cols-2 border-b border-devlog-border">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Link
            key={tab.id}
            href={tab.id === "login" ? "/login" : "/login?tab=signup"}
            className={`relative py-4 text-center text-sm font-medium transition ${
              isActive ? "text-devlog-accent" : "text-devlog-muted hover:text-devlog-text"
            }`}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-devlog-accent" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
