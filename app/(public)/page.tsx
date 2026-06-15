import Link from "next/link";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { LandingHero } from "@/components/public/LandingHero";
import { createClient } from "@/lib/supabase/server";
import { fetchPublishedTemplates, fetchCategories } from "@/lib/db/templates";

/* ── How-it-works ───────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Загвар сонгоно",
    desc: "Баярын төрөлдөө тохирох загвараа сонгоорой",
  },
  {
    n: "2",
    title: "Мэдээллээ оруулна",
    desc: "Нэр, огноо, байршлаа бөглөхөд урилга бэлэн",
  },
  {
    n: "3",
    title: "Линкээр хуваалцана",
    desc: "Зочдодоо линк илгээгээд хариуг нь хүлээн аваарай",
  },
];

/* ── Feature grid ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    title: "Мэргэжлийн загварууд",
    desc: "Дизайнерууд бүтээсэн чанартай загварууд тогтмол нэмэгдэнэ",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: "Шууд урьдчилан харах",
    desc: "Мэдээлэл оруулах бүрд урилга тань шууд шинэчлэгдэнэ",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 12C4 7.5 7.5 4.5 12 4.5S20 7.5 21.5 12C20 16.5 16.5 19.5 12 19.5S4 16.5 2.5 12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "Зураг оруулах",
    desc: "Өөрийн зургаа байршуулж, хүрээнд тааруулан засаарай",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="15" rx="2"/>
        <path d="M3 15l4-4 3 3 4-4 4 5"/>
        <circle cx="8.5" cy="7.5" r="1.5"/>
      </svg>
    ),
  },
  {
    title: "Нийтийн линк",
    desc: "Урилга бүр өөрийн гэсэн товч, ойлгомжтой линктэй",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 15l-4.5-1.5a2.5 2.5 0 010-4.7L18 4l-4.8 13.5a2.5 2.5 0 01-4.7 0L9 15z"/>
      </svg>
    ),
  },
  {
    title: "QR код",
    desc: "Хэвлэмэл материалд тавихад бэлэн QR код автоматаар үүснэ",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
      </svg>
    ),
  },
  {
    title: "Зураг ба видео",
    desc: "Урилгаа зураг эсвэл видео хэлбэрээр татаж аваарай",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="10" height="16" rx="1.5"/>
        <path d="M14 9l6-3.5v13L14 15"/>
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
    accent: false,
  },
  {
    who: "Хосуудад",
    text: "Хуримын урилгаа хэдхэн минутад бэлдээд, зочдын хариуг нэг дороос харж байгаарай.",
    name: "Т. Билгүүн",
    role: "Хуримын урилга",
    accent: true,
  },
  {
    who: "Байгууллагад",
    text: "Нээлт, хүлээн авалт, дотоод арга хэмжээ — брэндийн өнгө аястай урилга.",
    name: "MCS Group",
    role: "Корпоратив эвент",
    accent: false,
  },
];

/* ── Category cards ─────────────────────────────────────────────────────── */
// Icon SVGs matching design DSEventTypeCard eventIcons
function CatIcon({ type }: { type: string }) {
  if (type === "wedding") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9 4c1.5 0 2.5.8 3 1.5C12.5 4.8 13.5 4 15 4c2.5 0 5 2.5 5 5.5C20 15 12 21 12 21z"/>
    </svg>
  );
  if (type === "corporate") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  );
  if (type === "opening") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
  // birthday (default)
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8V4"/><circle cx="12" cy="3" r="1" fill="var(--color-accent)" stroke="none"/>
      <rect x="4" y="10" width="16" height="10" rx="3"/><path d="M4 14h16"/>
      <path d="M8 10V8a2 2 0 014 0v2"/><path d="M12 10V8a2 2 0 014 0v2"/>
    </svg>
  );
}

const CAT_USE_CASES = [
  { type: "birthday",  label: "Төрсөн өдөр",  count: 24, slug: "birthday" },
  { type: "wedding",   label: "Хурим",         count: 18, slug: "wedding" },
  { type: "corporate", label: "Корпоратив",    count: 12, slug: "corporate" },
  { type: "opening",   label: "Төгсөлт",       count: 9,  slug: "graduation" },
  { type: "birthday",  label: "Хүүхэд угтах",  count: 7,  slug: "baby-shower" },
  { type: "opening",   label: "Нээлт",         count: 8,  slug: "opening" },
];

/* ── Section heading helper ─────────────────────────────────────────────── */
function SecHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-9 text-center">
      <h2 className="text-[20px] font-bold tracking-tight text-(--color-text) md:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-[1.55] text-(--color-text-secondary)">{sub}</p>
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

      {/* ── How it works (surface band) ──────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-14 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрхэн ажилладаг вэ?" sub="Гурван энгийн алхам — урилга тань бэлэн" />
          <div className="flex flex-col gap-5 md:flex-row md:gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="flex flex-1 items-start gap-3.5">
                {/* Numbered icon box */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-(--color-accent-soft) text-[14px] font-bold text-(--color-accent)">
                  {s.n}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-(--color-text)">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-(--color-text-secondary)">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category cards ────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Ямар ч баярт тохирно" sub="Төрөл бүрийн арга хэмжээнд зориулсан загварууд" />
          <div className="flex flex-wrap justify-center gap-3">
            {CAT_USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={`/templates?category=${uc.slug}`}
                className="flex w-35 flex-col items-center gap-2 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) px-4 py-4 text-center transition-all hover:border-(--color-accent) hover:shadow-md"
              >
                <CatIcon type={uc.type} />
                <p className="text-[13px] font-medium text-(--color-text)">{uc.label}</p>
                <p className="text-[11px] text-(--color-text-muted)">{uc.count} загвар</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured templates (surface band) ───────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-(--color-text)">
                Онцлох загварууд
              </h2>
              <p className="mt-1 text-[14px] text-(--color-text-secondary)">
                Хамгийн их ашиглагдаж буй загварууд
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex h-8 items-center gap-1 rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-3 text-[12px] font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-soft) hover:text-(--color-text)"
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

      {/* ── Features grid (bg) ──────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэрэгтэй бүхэн нэг дор" sub="Урилга үүсгэхээс эхлээд зочдын хариу хүлээж авах хүртэл" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5"
              >
                <div>{f.icon}</div>
                <p className="text-[15px] font-semibold text-(--color-text)">{f.title}</p>
                <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases (surface band) ─────────────────────────────────────── */}
      <section className="border-y border-(--color-border) bg-(--color-surface) py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <SecHead title="Хэн ашигладаг вэ?" sub="Гэр бүлээс байгууллага хүртэл" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {USE_CASES.map((c) => (
              <div
                key={c.who}
                className="flex flex-col gap-4 rounded-panel border p-6"
                style={
                  c.accent
                    ? { backgroundColor: "var(--color-primary)", borderColor: "var(--color-border)", color: "#fff" }
                    : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }
                }
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-widest"
                  style={{ color: c.accent ? "rgba(255,255,255,0.6)" : "var(--color-accent)" }}
                >
                  {c.who}
                </p>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: c.accent ? "rgba(255,255,255,0.9)" : "var(--color-text-secondary)" }}
                >
                  {c.text}
                </p>
                <div className="mt-auto">
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: c.accent ? "#fff" : "var(--color-text)" }}
                  >
                    {c.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: c.accent ? "rgba(255,255,255,0.55)" : "var(--color-text-muted)" }}
                  >
                    {c.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
