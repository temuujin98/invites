import Link from "next/link";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { LandingHero } from "@/components/public/LandingHero";
import { createClient } from "@/lib/supabase/server";
import { fetchPublishedTemplates, fetchCategories } from "@/lib/db/templates";

/* ── How-it-works ───────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Загвар сонгоно",
    desc: "Баярын төрөлдөө тохирох загвараа сонгоорой. Хурим, төрсөн өдөр, корпоратив — бүгд байна.",
  },
  {
    n: "02",
    title: "Мэдээллээ оруулна",
    desc: "Нэр, огноо, байршлаа бөглөхөд урилга таны мэдээллээр шууд шинэчлэгдэнэ.",
  },
  {
    n: "03",
    title: "Линкээр хуваалцана",
    desc: "Зочдодоо линк эсвэл QR кодоор илгээгээд хариуг нь нэг дороос хүлээн аваарай.",
  },
];

/* ── Feature grid ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    title: "Мэргэжлийн загварууд",
    desc: "Дизайнерууд бүтээсэн загварууд тогтмол нэмэгдэнэ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: "Шууд урьдчилан харах",
    desc: "Мэдээлэл оруулах бүрд урилга тань шууд шинэчлэгдэнэ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 12C4 7.5 7.5 4.5 12 4.5S20 7.5 21.5 12C20 16.5 16.5 19.5 12 19.5S4 16.5 2.5 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "Зочдын хариу",
    desc: "Ирэх/ирэхгүй гэдэг хариуг онлайнаар нэг дороос цуглуулна",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M3 9h18"/>
      </svg>
    ),
  },
  {
    title: "QR код автоматаар",
    desc: "Хэвлэмэл материалд тавихад бэлэн QR код үүснэ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
      </svg>
    ),
  },
  {
    title: "Зураг ба видео татах",
    desc: "Урилгаа зураг эсвэл видео хэлбэрээр татаж аваарай",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="10" height="16" rx="1.5"/>
        <path d="M14 9l6-3.5v13L14 15"/>
      </svg>
    ),
  },
  {
    title: "Нийтийн линк",
    desc: "Урилга бүр өөрийн гэсэн товч, ойлгомжтой линктэй",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
];

/* ── Use cases ──────────────────────────────────────────────────────────── */
const USE_CASES = [
  {
    who: "Гэр бүлд",
    text: "Төрсөн өдөр, ой, угтах ёслол — дотны хүмүүстээ дулаан урилга илгээгээрэй.",
    name: "Б. Номин",
    role: "Хүүхдийн 1 насны ой",
  },
  {
    who: "Хосуудад",
    text: "Хуримын урилгаа хэдхэн минутад бэлдээд, зочдын хариуг нэг дороос харж байгаарай.",
    name: "Т. Билгүүн & Э. Анужин",
    role: "Хуримын урилга",
    featured: true,
  },
  {
    who: "Байгууллагад",
    text: "Нээлт, хүлээн авалт, дотоод арга хэмжээ — брэндийн өнгө аястай мэргэжлийн урилга.",
    name: "MCS Group",
    role: "Корпоратив эвент",
  },
];

/* ── Category cards ─────────────────────────────────────────────────────── */
function CatIcon({ type }: { type: string }) {
  if (type === "wedding") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9 4c1.5 0 2.5.8 3 1.5C12.5 4.8 13.5 4 15 4c2.5 0 5 2.5 5 5.5C20 15 12 21 12 21z"/>
    </svg>
  );
  if (type === "corporate") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  );
  if (type === "opening") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
  if (type === "baby") return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8"/>
      <path d="M9 10h.01M15 10h.01M9.5 14.5c.83.67 2 1 2.5 1s1.67-.33 2.5-1"/>
    </svg>
  );
  // birthday (default)
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8V4"/>
      <circle cx="12" cy="3" r="1" fill="var(--color-accent)" stroke="none"/>
      <rect x="4" y="10" width="16" height="10" rx="3"/>
      <path d="M4 14h16M8 10V8a2 2 0 014 0v2M12 10V8a2 2 0 014 0v2"/>
    </svg>
  );
}

const CAT_USE_CASES = [
  { type: "birthday",  label: "Төрсөн өдөр",  count: 24, slug: "birthday" },
  { type: "wedding",   label: "Хурим",         count: 18, slug: "wedding" },
  { type: "corporate", label: "Корпоратив",    count: 12, slug: "corporate" },
  { type: "opening",   label: "Төгсөлт",       count: 9,  slug: "graduation" },
  { type: "baby",      label: "Хүүхэд угтах",  count: 7,  slug: "baby-shower" },
  { type: "opening",   label: "Нээлт",         count: 8,  slug: "opening" },
];

/* ── Section heading helper ─────────────────────────────────────────────── */
function SecHead({ title, sub, center = true }: { title: string; sub: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2 className={`text-[26px] font-bold tracking-tight text-(--color-text) break-keep md:text-[32px] ${center ? "" : ""}`}>
        {title}
      </h2>
      <p className={`mt-2.5 text-[15px] leading-relaxed text-(--color-text-secondary) ${center ? "mx-auto max-w-lg" : ""}`}>
        {sub}
      </p>
    </div>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();
  const [{ data: { user } }, publishedTemplates, categories] = await Promise.all([
    supabase.auth.getUser(),
    fetchPublishedTemplates(),
    fetchCategories(),
  ]);
  const featuredTemplates = publishedTemplates.slice(0, 4);
  const heroTemplate = publishedTemplates.find((t) => t.slug === "wedding-luxury") ?? publishedTemplates[0];

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {heroTemplate && <LandingHero loggedIn={!!user} heroTemplate={heroTemplate} />}

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрхэн ажилладаг вэ?" sub="Гурван энгийн алхам — урилга тань бэлэн" />

          <div className="relative flex flex-col gap-8 md:flex-row md:gap-0">
            {/* Connector line — desktop only */}
            <div
              className="pointer-events-none absolute top-9 hidden h-px w-full md:block"
              style={{ background: "linear-gradient(to right, transparent 8%, var(--color-border) 20%, var(--color-border) 80%, transparent 92%)" }}
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.n} className="relative flex flex-1 flex-col items-start gap-4 md:items-center md:px-6 md:text-center">
                {/* Step number circle */}
                <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-2 border-accent/20 bg-(--color-accent-soft)">
                  <span className="text-[22px] font-bold text-(--color-accent)">{i + 1}</span>
                  {/* White ring to sit over the connector line */}
                  <div className="absolute -inset-1 hidden rounded-full border-4 border-(--color-surface) md:block" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-(--color-text)">{s.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-(--color-text-secondary)">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category cards ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Ямар ч баярт тохирно" sub="Төрөл бүрийн арга хэмжээнд зориулсан загварууд" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
            {CAT_USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={`/templates?category=${uc.slug}`}
                className="group flex flex-col items-center gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-3 py-5 text-center transition-all duration-300 hover:border-accent/40 hover:bg-(--color-accent-soft) hover:shadow-md"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <CatIcon type={uc.type} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-(--color-text)">{uc.label}</p>
                  <p className="mt-0.5 text-[11px] text-(--color-text-muted)">{uc.count} загвар</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured templates ───────────────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-[26px] font-bold tracking-tight text-(--color-text) break-keep md:text-[32px]">
                Онцлох загварууд
              </h2>
              <p className="mt-2 text-[15px] text-(--color-text-secondary)">
                Хамгийн их ашиглагдаж буй загварууд
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-4 text-[13px] font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-soft) hover:text-(--color-text)"
            >
              Бүгдийг үзэх
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {featuredTemplates.map((tpl) => {
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

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрэгтэй бүхэн нэг дор" sub="Урилга үүсгэхээс эхлээд зочдын хариу хүлээж авах хүртэл" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-3.5 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent-soft) text-(--color-accent) transition-colors duration-300 group-hover:bg-(--color-accent) group-hover:text-white">
                  {f.icon}
                </div>
                <p className="text-[15px] font-semibold text-(--color-text)">{f.title}</p>
                <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ────────────────────────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэн ашигладаг вэ?" sub="Гэр бүлээс байгууллага хүртэл" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {USE_CASES.map((c) => (
              <div
                key={c.who}
                className={[
                  "flex flex-col gap-4 rounded-(--radius-card) border p-6 transition-all duration-300",
                  c.featured
                    ? "border-transparent bg-(--color-primary) text-white"
                    : "border-(--color-border) bg-(--color-bg) hover:border-accent/30 hover:shadow-md",
                ].join(" ")}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-widest ${c.featured ? "text-white/55" : "text-(--color-accent)"}`}>
                  {c.who}
                </p>
                <p className={`text-[14px] leading-relaxed ${c.featured ? "text-white/85" : "text-(--color-text-secondary)"}`}>
                  {c.text}
                </p>
                <div className={`mt-auto border-t pt-4 ${c.featured ? "border-white/12" : "border-(--color-border)"}`}>
                  <p className={`text-[13px] font-semibold ${c.featured ? "text-white" : "text-(--color-text)"}`}>
                    {c.name}
                  </p>
                  <p className={`mt-0.5 text-[12px] ${c.featured ? "text-white/50" : "text-(--color-text-muted)"}`}>
                    {c.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div
            className="relative overflow-hidden rounded-(--radius-card) px-8 py-14 text-center md:px-16 md:py-20"
            style={{ background: "linear-gradient(135deg, #2A2725 0%, #1A1816 100%)" }}
          >
            {/* Decorative glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: "rgba(139,92,246,0.25)" }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-white/45">
                Одоо эхлэцгээе
              </p>
              <h2 className="mb-4 text-[28px] font-bold leading-tight tracking-tight text-white break-keep md:text-[40px]">
                Таны баярын урилга<br className="hidden sm:block" /> минутын дотор бэлэн
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-white/65">
                Бүртгүүлэхэд зардал байхгүй. Загвараа сонгоод шууд эхлэцгээе.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={user ? "/templates" : "/register"}
                  className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) bg-(--color-accent) px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-(--color-accent-hover) active:scale-[0.98]"
                  style={{ boxShadow: "0 4px 20px rgba(139,92,246,0.40)" }}
                >
                  Үнэгүй эхлэх
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center justify-center rounded-(--radius-ctrl) border border-white/20 px-8 text-[15px] font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:text-white active:scale-[0.98]"
                >
                  Загварууд үзэх
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
