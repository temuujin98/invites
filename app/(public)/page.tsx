import Link from "next/link";
import { mockTemplates, mockCategories } from "@/lib/mock-data";
import { TemplateCard } from "@/components/invite/TemplateCard";
import { LandingHero } from "@/components/public/LandingHero";

const publishedTemplates = mockTemplates.filter((t) => t.status === "published");

const FEATURES = [
  {
    icon: "⚡",
    title: "Хялбар үүсгэх",
    desc: "Загвар сонгоод мэдээллээ оруулбал хэдхэн минутад урилга бэлэн болно.",
  },
  {
    icon: "📱",
    title: "Мобайл-д тохиромжтой",
    desc: "Урилга нь утасны дэлгэцэнд гоёмсог харагдахаар тусгайлан зохион бүтээгдсэн.",
  },
  {
    icon: "🔗",
    title: "Нэг холбоосоор хуваалцах",
    desc: "Урилгаа линкээр Messenger, WhatsApp, Facebook-д хялбархан хуваалцаарай.",
  },
  {
    icon: "✅",
    title: "RSVP хариу авах",
    desc: "Зочид шууд урилга дотроос ирэх эсэхээ мэдэгдэх боломжтой.",
  },
  {
    icon: "🎨",
    title: "Олон загвар",
    desc: "Хурим, төрсөн өдөр, төгсөлт зэрэг янз бүрийн арга хэмжээнд тохирсон загварууд.",
  },
  {
    icon: "🆓",
    title: "Үнэгүй эхлэх",
    desc: "Бүртгэл үүсгэж шуурхай эхэл. Нэмэлт төлбөр, нуугдмал үнэ байхгүй.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Загвар сонго",
    desc: "Арга хэмжээнийхээ шинжид тохирсон загварыг сонго.",
  },
  {
    step: "02",
    title: "Мэдээллээ оруул",
    desc: "Арга хэмжээний нэр, огноо, байршил, зураг болон бусад мэдээллийг бөглө.",
  },
  {
    step: "03",
    title: "Хуваалцаж RSVP ав",
    desc: "Урилгын линкийг зочдод илгээгээд хариуг хянаарай.",
  },
];

const USE_CASES = [
  { emoji: "💍", label: "Хуримын ёслол" },
  { emoji: "🎂", label: "Төрсөн өдрийн баяр" },
  { emoji: "🎓", label: "Төгсөлтийн ёслол" },
  { emoji: "🏢", label: "Корпорейт арга хэмжээ" },
  { emoji: "🎈", label: "Хүүхдийн баяр" },
  { emoji: "🎉", label: "Бусад арга хэмжээ" },
];

export default function LandingPage() {
  const featuredTemplates = publishedTemplates.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <LandingHero />

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-(--color-accent) mb-2">
              Хэрхэн ажилладаг вэ?
            </p>
            <h2 className="text-2xl font-bold text-(--color-text) md:text-3xl">
              3 алхамд урилга үүсгэ
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="text-3xl font-bold text-(--color-surface-soft) leading-none select-none">
                  {item.step}
                </span>
                <div className="h-px w-8 bg-(--color-accent)" />
                <h3 className="text-base font-semibold text-(--color-text)">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-(--color-text-secondary)">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category cards ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-xl font-bold text-(--color-text) md:text-2xl">
              Ямар арга хэмжээнд ашиглах вэ?
            </h2>
            <Link
              href="/templates"
              className="text-sm font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors shrink-0"
            >
              Бүх загвар →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={`/templates?category=${mockCategories.find((c) => c.name === uc.label)?.slug ?? ""}`}
                className="group flex flex-col items-center gap-2 rounded-(--radius-card-lg) border border-(--color-border) bg-(--color-surface) p-4 transition-shadow hover:shadow-(--shadow-md) hover:border-(--color-accent)/30"
              >
                <span className="text-3xl md:text-4xl" aria-hidden="true">
                  {uc.emoji}
                </span>
                <span className="text-center text-xs font-medium text-(--color-text) leading-tight">
                  {uc.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured templates ────────────────────────────────────────── */}
      <section className="bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-xl font-bold text-(--color-text) md:text-2xl">
              Алдартай загварууд
            </h2>
            <Link
              href="/templates"
              className="text-sm font-medium text-(--color-accent) hover:text-(--color-accent-hover) transition-colors shrink-0"
            >
              Бүгдийг харах →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featuredTemplates.map((tpl) => {
              const cat = mockCategories.find((c) => c.id === tpl.categoryId);
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

      {/* ── 6-feature grid ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-xl font-bold text-(--color-text) md:text-2xl">
              Яагаад invites.mn?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 rounded-(--radius-card-lg) border border-(--color-border) bg-(--color-surface) p-5"
              >
                <span className="text-2xl" aria-hidden="true">{f.icon}</span>
                <h3 className="text-[15px] font-semibold text-(--color-text)">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use-case cards ────────────────────────────────────────────── */}
      <section className="bg-(--color-surface) py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="mb-8 text-xl font-bold text-(--color-text) md:text-2xl">
            Хэн ашигладаг вэ?
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-(--radius-card-lg) border border-(--color-border) p-6">
              <p className="mb-1 text-2xl">👰</p>
              <h3 className="mb-2 text-[15px] font-semibold text-(--color-text)">
                Гэр бүл болж буй хосууд
              </h3>
              <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">
                Хуримын урилгаа гоёмсог дижитал хэлбэрт оруулж, бүх зочиддоо хялбархан хүргэ.
              </p>
            </div>
            <div className="rounded-(--radius-card-lg) border border-(--color-border) p-6">
              <p className="mb-1 text-2xl">🎉</p>
              <h3 className="mb-2 text-[15px] font-semibold text-(--color-text)">
                Эцэг эхчүүд
              </h3>
              <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">
                Хүүхдийнхээ баярын урилгыг хэдхэн минутад үүсгэж, анд нөхдөдөө илгээ.
              </p>
            </div>
            <div className="rounded-(--radius-card-lg) border border-(--color-border) p-6">
              <p className="mb-1 text-2xl">🏢</p>
              <h3 className="mb-2 text-[15px] font-semibold text-(--color-text)">
                Байгууллага, брэнд
              </h3>
              <p className="text-[14px] leading-relaxed text-(--color-text-secondary)">
                Корпорейт арга хэмжээ, presentation, хуралдааны урилгыг мэргэжлийн түвшинд бүтээ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <h2 className="mb-4 text-2xl font-bold text-(--color-text) md:text-3xl">
            Өнөөдөр урилга үүсгэж эхэл
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-(--color-text-secondary)">
            Бүртгэл үүсгэх шаардлагагүй. Загвар сонгоод шуурхай эхэл.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/templates"
              className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) bg-(--color-primary) px-6 text-[15px] font-medium text-white hover:bg-(--color-primary-hover) transition-colors"
            >
              Загвар харах
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-(--radius-ctrl) border border-(--color-border) bg-(--color-surface) px-6 text-[15px] font-medium text-(--color-text) hover:bg-(--color-surface-soft) transition-colors"
            >
              Бүртгэл үүсгэх
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
