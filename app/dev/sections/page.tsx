"use client";

import { useState } from "react";
import { SectionRenderer } from "@/components/invite/SectionRenderer";
import { InvitationShell } from "@/components/invite/InvitationShell";
import { PhonePreviewFrame } from "@/components/invite/PhonePreviewFrame";
import type { SectionMode } from "@/components/invite/sections/types";
import { FIXTURE_TEMPLATE, FIXTURE_CONTENT } from "./fixture";

const MODES: { key: SectionMode; label: string }[] = [
  { key: "editor", label: "Editor" },
  { key: "create", label: "Create" },
  { key: "public", label: "Public" },
];

export default function SectionSandboxPage() {
  const [mode, setMode] = useState<SectionMode>("public");
  const [selected, setSelected] = useState<string | undefined>();
  const [wrapPhone, setWrapPhone] = useState(true);

  const rendered = (
    <SectionRenderer
      template={FIXTURE_TEMPLATE}
      content={FIXTURE_CONTENT}
      mode={mode}
      selectedSectionId={selected}
      onSectionSelect={setSelected}
      inviteId={mode === "public" ? "fixture-invite" : undefined}
      shareSlug={mode === "public" ? "sandbox" : undefined}
      inviteTitle="Бат-Эрдэнэ & Солонго"
    />
  );

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto mb-6 flex max-w-md flex-col gap-3">
        <h1 className="text-lg font-bold text-neutral-800">Section renderer sandbox</h1>
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === m.key ? "bg-violet-600 text-white" : "bg-white text-neutral-700 border"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() => setWrapPhone((v) => !v)}
            className="ml-auto rounded-md border bg-white px-3 py-1.5 text-sm text-neutral-700"
          >
            {wrapPhone ? "Full width" : "Phone frame"}
          </button>
        </div>
        {mode === "editor" && selected && (
          <p className="text-xs text-neutral-500">Сонгосон: {selected}</p>
        )}
      </div>

      <div className="flex justify-center">
        {wrapPhone ? (
          <div className="w-[390px]">
            <PhonePreviewFrame canvasWidth={390} canvasHeight={844}>
              <div className="h-full overflow-y-auto">
                {mode === "public" ? (
                  <InvitationShell
                    template={FIXTURE_TEMPLATE}
                    content={FIXTURE_CONTENT}
                    showOpening
                    openingTitle="Бат-Эрдэнэ & Солонго"
                  >
                    {rendered}
                  </InvitationShell>
                ) : (
                  rendered
                )}
              </div>
            </PhonePreviewFrame>
          </div>
        ) : (
          <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow">
            {rendered}
          </div>
        )}
      </div>
    </div>
  );
}
