"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PublicInviteView, type PublicInviteRow } from "@/components/invite/PublicInviteView";

// Public share-link path: fetches by share_slug with the anon client (relies on
// the invites public-read RLS policy) and hands the row to the shared view.
export function PublicInviteClient({ shareSlug }: { shareSlug: string }) {
  const [invite, setInvite] = useState<PublicInviteRow | null | "loading">("loading");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("invites")
        .select(`
          id, title, share_slug, status, is_public, content,
          event_date, event_time, event_location,
          templates ( id, slug, name, category_id, status, sections, theme )
        `)
        .eq("share_slug", shareSlug)
        .single();

      if (!data) {
        setInvite(null);
        return;
      }

      const tplRaw = data.templates;
      const tpl = Array.isArray(tplRaw) ? (tplRaw[0] ?? null) : (tplRaw ?? null);
      setInvite({ ...data, templates: tpl } as PublicInviteRow);
    })();
  }, [shareSlug]);

  return <PublicInviteView invite={invite} />;
}
