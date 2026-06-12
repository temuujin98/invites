import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-8 md:px-6 md:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-65">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-(--color-accent)">
                <span className="text-[12px] font-bold text-white">i</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white">invites</span>
            </div>
            <p className="text-xs leading-relaxed text-white/55">
              Монголын дижитал урилгын платформ. Минутын дотор гоё урилга.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/45">
                Бүтээгдэхүүн
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/templates" className="text-xs text-white/75 transition-colors hover:text-white">
                    Загварууд
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-xs text-white/75 transition-colors hover:text-white">
                    Бүртгүүлэх
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/45">
                Дэмжлэг
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="mailto:hello@invites.mn"
                    className="text-xs text-white/75 transition-colors hover:text-white"
                  >
                    Холбоо барих
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/12 pt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/40">
            © 2026 invites. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-[11px] text-white/40">
            Нууцлалын бодлого · Үйлчилгээний нөхцөл
          </p>
        </div>
      </div>
    </footer>
  );
}
