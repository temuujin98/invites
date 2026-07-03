import { APP_URL } from "@/lib/constants";

// ── OG image resolution for invite metadata ──────────────────────────────────
// A published invite's social preview is the dynamically rendered landscape
// card. If a render has already been cached on the row (rendered_image_url) we
// reuse it, cache-busted by updated_at so an edited invite doesn't unfurl stale.
// Otherwise we point at the render route, which produces + caches it on first
// crawl. Falls back to the static default for anything without a slug.

const LANDSCAPE = { width: 1200, height: 630 } as const;

interface InviteOgFields {
  share_slug?: string | null;
  rendered_image_url?: string | null;
  updated_at?: string | null;
}

export function resolveOgImage(
  shareSlug: string,
  invite: InviteOgFields,
): { url: string; width: number; height: number } {
  const version = invite.updated_at ? `?v=${encodeURIComponent(invite.updated_at)}` : "";

  if (invite.rendered_image_url) {
    return { url: `${invite.rendered_image_url}${version}`, ...LANDSCAPE };
  }

  return {
    url: `${APP_URL}/api/og/${shareSlug}${version}`,
    ...LANDSCAPE,
  };
}
