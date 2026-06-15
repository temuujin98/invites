import { PublicHeader } from "@/components/shared/PublicHeader";
import { PublicFooter } from "@/components/shared/PublicFooter";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let headerUser: { displayName: string; email: string } | null = null;
  if (user) {
    const displayName =
      (user.user_metadata?.display_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Хэрэглэгч";
    headerUser = { displayName, email: user.email ?? "" };
  }

  return (
    <>
      <PublicHeader user={headerUser} />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
