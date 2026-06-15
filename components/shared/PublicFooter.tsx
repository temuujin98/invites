import Image from "next/image";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-(--color-primary) text-white">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-8 md:px-6 md:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          {/* Brand */}
          <div className="max-w-64">
            <div className="mb-3">
              <Image src="/logo-white.png" alt="invites.mn" height={26} width={130} style={{ width: "auto", height: 26 }} />
            </div>
            <p className="text-[13px] leading-relaxed text-white/55">
              Монголын дижитал урилгын платформ.<br />
              Минутын дотор гоё урилга бэлд.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Бүтээгдэхүүн
              </p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link href="/templates" className="text-[13px] text-white/70 transition-colors hover:text-white">
                    Загварууд
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-[13px] text-white/70 transition-colors hover:text-white">
                    Бүртгүүлэх
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[13px] text-white/70 transition-colors hover:text-white">
                    Нэвтрэх
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Дэмжлэг
              </p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a
                    href="mailto:hello@invites.mn"
                    className="text-[13px] text-white/70 transition-colors hover:text-white"
                  >
                    Холбоо барих
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/35">
            © 2026 invites.mn — Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-[12px] text-white/35">
            Нууцлалын бодлого · Үйлчилгээний нөхцөл
          </p>
        </div>
      </div>
    </footer>
  );
}
