import { redirect } from "next/navigation";
import { PostEditor } from "@/components/write/post-editor";
import { createClient } from "@/lib/supabase/server";

export default async function WritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/write");
  }

  return <PostEditor />;
}
