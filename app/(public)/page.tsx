import Link from "next/link";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { LandingHero } from "@/components/public/LandingHero";
import { ShareQrVisual } from "@/components/public/ShareQrVisual";
import { createClient } from "@/lib/supabase/server";
import { fetchTemplateSummaries, fetchCategories } from "@/lib/db/templates";

/* ── How-it-works ───────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Загвар сонгоно",
    desc: "Баярын төрөлдөө тохирох загвараа сонгоорой. Хурим, төрсөн өдөр, корпоратив — бүгд байна.",
    detail: "60+ загвараас сонго",
  },
  {
    n: "02",
    title: "Мэдээллээ оруулна",
    desc: "Нэр, огноо, байршлаа бөглөхөд урилга таны мэдээллээр шууд шинэчлэгдэнэ.",
    detail: "Шууд урьдчилан харах",
  },
  {
    n: "03",
    title: "Хуваалцана",
    desc: "Зочдодоо линк эсвэл QR кодоор илгээгээд хариуг нэг дороос цуглуулаарай.",
    detail: "invites.mn/i/таны-нэр",
  },
];

/* ── Zig-zag feature blocks ─────────────────────────────────────────────── */
const FEATURE_BLOCKS = [
  {
    title: "Шууд урьдчилан харах",
    desc: "Мэдээлэл оруулах бүрд урилга тань шууд шинэчлэгдэнэ. Огноо, нэр, байршлаа бөглөхөд ямар харагдахыг нь тэр даруй харна.",
    pill: "Шуурхай засварлалт",
    visual: (
      <div className="flex h-full items-center justify-center rounded-(--radius-card) bg-(--color-surface) p-6">
        <div className="w-full max-w-xs rounded-(--radius-card) border border-(--color-border) bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-(--color-accent)" />
            <p className="text-[11px] font-semibold text-(--color-accent)">Шууд харагдаж байна</p>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-accent/20" />
            <div className="h-2.5 w-1/2 rounded-full bg-(--color-surface-soft)" />
            <div className="h-2.5 w-2/3 rounded-full bg-(--color-surface-soft)" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded-(--radius-ctrl) bg-accent/15" />
            <div className="h-8 flex-1 rounded-(--radius-ctrl) bg-(--color-surface-soft)" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Зочдын хариуг нэг дороос",
    desc: "Зочид тань ямар ч төхөөрөмжөөс ирэх/ирэхгүйгээ мэдэгдэнэ. Та бүх хариуг нэг самбараас харна — утас шаардлагагүй.",
    pill: "RSVP хянах",
    visual: (
      <div className="flex h-full items-center justify-center rounded-(--radius-card) bg-(--color-surface) p-6">
        <div className="w-full max-w-xs space-y-2">
          {[
            { name: "Б. Номин", status: "Ирнэ", color: "text-(--color-success)" },
            { name: "Т. Билгүүн", status: "Ирнэ", color: "text-(--color-success)" },
            { name: "Э. Анужин", status: "Ирэхгүй", color: "text-(--color-danger)" },
            { name: "Д. Мөнхбат", status: "Хүлээгдэж байна", color: "text-(--color-text-muted)" },
          ].map((g) => (
            <div key={g.name} className="flex items-center justify-between rounded-(--radius-ctrl) border border-(--color-border) bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-accent-soft) text-[10px] font-bold text-(--color-accent)">
                  {g.name[0]}
                </div>
                <p className="text-[12px] font-medium text-(--color-text)">{g.name}</p>
              </div>
              <p className={`text-[11px] font-medium ${g.color}`}>{g.status}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "QR код ба линк — хаанаас ч хуваалц",
    desc: "Урилга бүр өөрийн гэсэн QR код болон богино линктэй. Хэвлэмэл материалд тавих, мессенжерт илгээх — хаанаас ч хуваалцаарай.",
    pill: "Хуваалцах",
    visual: <ShareQrVisual />,
  },
];

/* ── Use cases ──────────────────────────────────────────────────────────── */
const USE_CASES = [
  {
    who: "Гэр бүлд",
    text: "Төрсөн өдөр, ой, угтах ёслол — дотны хүмүүстээ дулаан урилга илгээгээрэй.",
    name: "Б. Номин",
    role: "Хүүхдийн 1 насны ой",
    emoji: "🎂",
  },
  {
    who: "Хосуудад",
    text: "Хуримын урилгаа хэдхэн минутад бэлдээд, зочдын хариуг нэг дороос харж байгаарай.",
    name: "Т. Билгүүн & Э. Анужин",
    role: "Хуримын урилга",
    emoji: "💍",
    featured: true,
  },
  {
    who: "Байгууллагад",
    text: "Нээлт, хүлээн авалт, дотоод арга хэмжээ — брэндийн өнгө аястай мэргэжлийн урилга.",
    name: "MCS Group",
    role: "Корпоратив эвент",
    emoji: "🏢",
  },
];

/* ── Category data ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Хурим",        count: 18, slug: "wedding",     emoji: "💍" },
  { label: "Төрсөн өдөр",  count: 24, slug: "birthday",    emoji: "🎂" },
  { label: "Корпоратив",   count: 12, slug: "corporate",   emoji: "🏢" },
  { label: "Төгсөлт",      count: 9,  slug: "graduation",  emoji: "🎓" },
  { label: "Хүүхэд угтах", count: 7,  slug: "baby-shower", emoji: "🍼" },
  { label: "Нээлт",        count: 8,  slug: "opening",     emoji: "✨" },
];

/* ── Section heading ────────────────────────────────────────────────────── */
function SecHead({ title, sub, light = false }: { title: string; sub: string; light?: boolean }) {
  return (
    <div className="mb-10 text-center">
      <h2 className={`text-[26px] font-bold tracking-tight break-keep md:text-[34px] ${light ? "text-white" : "text-(--color-text)"}`}>
        {title}
      </h2>
      <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/60" : "text-(--color-text-secondary)"}`}>
        {sub}
      </p>
    </div>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();
  const [{ data: { user } }, publishedTemplates, categories] = await Promise.all([
    supabase.auth.getUser(),
    fetchTemplateSummaries(),
    fetchCategories(),
  ]);
  const featuredTemplates = publishedTemplates.slice(0, 6);

  return (
    <div className="flex flex-col">

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <LandingHero loggedIn={!!user} />

      {/* ── 2. Template scroll strip — "see what people make" ────────────── */}
      {featuredTemplates.length > 0 && (
        <section className="border-b border-(--color-border) bg-(--color-surface) py-5">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Сүүлд үүсгэгдсэн урилгууд
            </p>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {featuredTemplates.map((tpl) => {
                const cat = categories.find((c) => c.id === tpl.categoryId);
                return (
                  <div key={tpl.id} className="w-28 shrink-0 md:w-36">
                    <TemplateCard
                      template={tpl}
                      category={cat}
                      href={`/templates/${tpl.slug}`}
                    />
                  </div>
                );
              })}
              <Link
                href="/templates"
                className="flex w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-(--radius-card) border border-(--color-border) bg-(--color-bg) text-center transition-colors hover:bg-(--color-surface-soft) md:w-36"
              >
                <span className="text-[20px] text-(--color-text-muted)">→</span>
                <p className="text-[11px] font-medium text-(--color-text-muted)">Бүгдийг харах</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. How it works ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрхэн ажилладаг вэ?" sub="Гурван алхам — хэдхэн минутад урилга бэлэн" />
          <div className="flex flex-col gap-6 md:flex-row md:gap-4">
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.n}
                className="relative flex flex-1 flex-col gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-6"
              >
                {/* Connector arrow between steps — desktop only */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute -right-3 top-8 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg) text-(--color-text-muted) md:flex">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-accent-soft) text-[15px] font-bold text-(--color-accent)">
                    {i + 1}
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">{s.detail}</p>
                </div>
                <p className="text-[16px] font-bold text-(--color-text)">{s.title}</p>
                <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Featured templates (real DB) ──────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-[26px] font-bold tracking-tight text-(--color-text) break-keep md:text-[34px]">
                Онцлох загварууд
              </h2>
              <p className="mt-2 text-[15px] text-(--color-text-secondary)">
                Дизайнерууд бүтээсэн, тогтмол нэмэгддэг
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-4 text-[13px] font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-soft)"
            >
              Бүгдийг үзэх
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-5">
            {featuredTemplates.slice(0, 6).map((tpl) => {
              const cat = categories.find((c) => c.id === tpl.categoryId);
              return (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  category={cat}
                  href={`/templates/${tpl.slug}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Zig-zag feature blocks ────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрэгтэй бүхэн нэг дор" sub="Урилга үүсгэхээс зочдын хариу хүлээж авах хүртэл" />

          <div className="flex flex-col gap-12 md:gap-16">
            {FEATURE_BLOCKS.map((f, i) => (
              <div
                key={f.title}
                className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Text side */}
                <div className="flex flex-1 flex-col gap-4">
                  <span className="inline-flex w-fit items-center rounded-full bg-(--color-accent-soft) px-3 py-1 text-[11px] font-semibold text-(--color-accent)">
                    {f.pill}
                  </span>
                  <h3 className="text-[20px] font-bold tracking-tight text-(--color-text) break-keep md:text-[24px]">
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7] text-(--color-text-secondary)">
                    {f.desc}
                  </p>
                </div>

                {/* Visual side */}
                <div className="h-52 flex-1 overflow-hidden rounded-(--radius-card) border border-(--color-border) md:h-64">
                  {f.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Category browser ──────────────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Ямар ч баярт тохирно" sub="Төрөл бүрийн арга хэмжээнд зориулсан загварууд" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/templates?category=${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-bg) px-3 py-5 text-center transition-all duration-200 hover:border-accent/40 hover:bg-(--color-accent-soft) hover:shadow-md"
              >
                <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                  {c.emoji}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-(--color-text)">{c.label}</p>
                  <p className="mt-0.5 text-[11px] text-(--color-text-muted)">{c.count} загвар</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Social proof / use cases ──────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэн ашигладаг вэ?" sub="Гэр бүлээс байгууллага хүртэл" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {USE_CASES.map((c) => (
              <div
                key={c.who}
                className={[
                  "flex flex-col gap-5 rounded-(--radius-card) border p-6 transition-all duration-200",
                  c.featured
                    ? "border-transparent bg-(--color-primary)"
                    : "border-(--color-border) bg-(--color-surface) hover:border-accent/25 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${c.featured ? "text-white/50" : "text-(--color-accent)"}`}>
                    {c.who}
                  </p>
                </div>
                <p className={`flex-1 text-[14px] leading-relaxed ${c.featured ? "text-white/80" : "text-(--color-text-secondary)"}`}>
                  {c.text}
                </p>
                <div className={`border-t pt-4 ${c.featured ? "border-white/12" : "border-(--color-border)"}`}>
                  <p className={`text-[13px] font-semibold ${c.featured ? "text-white" : "text-(--color-text)"}`}>{c.name}</p>
                  <p className={`mt-0.5 text-[12px] ${c.featured ? "text-white/45" : "text-(--color-text-muted)"}`}>{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA — full-bleed dark ───────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(160deg, #1F1B2E 0%, #2A2725 100%)" }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(139,92,246,0.20)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Одоо эхлэцгээе
          </p>
          <h2 className="mb-4 text-[28px] font-bold leading-tight tracking-tight text-white break-keep md:text-[42px]">
            Таны баярын урилга<br className="hidden sm:block" /> минутын дотор бэлэн
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-white/55">
            Бүртгүүлэхэд зардал байхгүй. Загвараа сонгоод шууд эхлэцгээе.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={user ? "/templates" : "/register"}
              className="inline-flex h-13 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-10 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-(--color-accent-hover) active:scale-[0.98]"
              style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.45)" }}
            >
              Эхлэх
            </Link>
            <Link
              href="/templates"
              className="inline-flex h-13 items-center justify-center rounded-(--radius-ctrl) border border-white/20 px-10 text-[15px] font-medium text-white/75 transition-all duration-300 hover:border-white/40 hover:text-white active:scale-[0.98]"
            >
              Загварууд үзэх
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
