import { HomeContent } from "@/components/home/home-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-devlog-bg text-devlog-text">
      <SiteHeader userEmail={user?.email} />
      <main className="flex-1">
        <HomeContent />
      </main>
      <SiteFooter />
    </div>
  );
}
