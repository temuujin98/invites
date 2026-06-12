import Link from "next/link";

export function PublicFooter() {
  const cols = [
    {
      heading: "Бүтээгдэхүүн",
      links: [
        { label: "Загварууд", href: "/templates" },
        { label: "Үнэ", href: "/pricing" },
        { label: "Шинэ боломжууд", href: "/changelog" },
      ],
    },
    {
      heading: "Тусламж",
      links: [
        { label: "Заавар", href: "/help" },
        { label: "Түгээмэл асуулт", href: "/faq" },
        { label: "Холбоо барих", href: "/contact" },
      ],
    },
    {
      heading: "Компани",
      links: [
        { label: "Бидний тухай", href: "/about" },
        { label: "Үйлчилгээний нөхцөл", href: "/terms" },
        { label: "Нууцлал", href: "/privacy" },
      ],
    },
  ];

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
            {cols.map((col) => (
              <div key={col.heading}>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/45">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/12 pt-5">
          <p className="text-[11px] text-white/40">
            © 2026 invites. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
