/* invites — Pages: shared primitives (PublicHeader, PublicFooter, InviteCard, placeholders) */

/* striped image placeholder helper */
function stripeBg(deg = 135, opacity = 0.05) {
  return `repeating-linear-gradient(${deg}deg, transparent, transparent 10px, rgba(139,92,246,${opacity}) 10px, rgba(139,92,246,${opacity}) 11px)`;
}

function PLogo({ size = 26, withText = true, textSize = 16 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: size * 0.5, fontWeight: 700 }}>i</span>
      </div>
      {withText && <span style={{ fontSize: textSize, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text-primary)' }}>invites</span>}
    </div>
  );
}

/* ——— PublicHeader ——— */
function PublicHeader({ active = '' }) {
  const nav = ['Загварууд', 'Хэрхэн ажилладаг', 'Үнэ'];
  return (
    <div style={{
      height: 64, padding: '0 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <PLogo />
        <nav style={{ display: 'flex', gap: 28 }}>
          {nav.map(n => (
            <span key={n} style={{
              fontSize: 12, fontWeight: n === active ? 500 : 400, cursor: 'pointer',
              color: n === active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}>{n}</span>
          ))}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Нэвтрэх</span>
        <DSButton variant="primary">Урилга үүсгэх</DSButton>
      </div>
    </div>
  );
}

function MobileHeader({ title }) {
  const Burger = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"><line x1="2.5" y1="5" x2="15.5" y2="5"/><line x1="2.5" y1="9" x2="15.5" y2="9"/><line x1="2.5" y1="13" x2="15.5" y2="13"/></svg>;
  return (
    <div style={{
      height: 56, padding: '0 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
    }}>
      {title ? <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span> : <PLogo size={24} textSize={15} />}
      <Burger />
    </div>
  );
}

/* ——— PublicFooter ——— */
function PublicFooter({ compact = false }) {
  const cols = [
    { h: 'Бүтээгдэхүүн', items: ['Загварууд', 'Үнэ', 'Шинэ боломжууд'] },
    { h: 'Тусламж', items: ['Заавар', 'Түгээмэл асуулт', 'Холбоо барих'] },
    { h: 'Компани', items: ['Бидний тухай', 'Үйлчилгээний нөхцөл', 'Нууцлал'] },
  ];
  return (
    <div style={{ backgroundColor: 'var(--color-primary)', padding: compact ? '32px 20px 24px' : '48px 48px 32px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
        <div style={{ maxWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>i</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>invites</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Монголын дижитал урилгын платформ. Минутын дотор гоё урилга.
          </div>
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: 64 }}>
            {cols.map(c => (
              <div key={c.h}>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>{c.h}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.items.map(it => <span key={it} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
        © 2026 invites. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </div>
  );
}

/* ——— InviteCard: the rendered invitation (phone preview + public invite page) ——— */
function InviteCard({ scale = 1, photo = true, frame = true }) {
  const Row = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</div>
      </div>
    </div>
  );
  return (
    <div style={{
      backgroundColor: '#FDFCFA', padding: frame ? 10 : 0,
      transform: scale !== 1 ? `scale(${scale})` : 'none', transformOrigin: 'top center',
    }}>
      <div style={{ border: frame ? '1px solid var(--color-border)' : 'none', borderRadius: frame ? 4 : 0, padding: '28px 22px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.32em', color: 'var(--color-accent)', fontWeight: 500, marginBottom: 16 }}>УРИЛГА</div>
        {photo && (
          <div style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
            background: stripeBg(45, 0.08), backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>зураг</span>
          </div>
        )}
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 6 }}>Анужингийн төрсөн өдөр</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 20 }}>Бат-Эрдэнэ гэр бүлээс урьж байна</div>
        <div style={{ width: 36, height: 1.5, backgroundColor: 'var(--color-accent)', margin: '0 auto 20px', borderRadius: 1 }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <Row icon={<CalendarIcon/>} label="Огноо" value="2026.06.21, Ням" />
          <Row icon={<ClockIcon/>} label="Цаг" value="18:00" />
          <Row icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13s4.5-3.8 4.5-7A4.5 4.5 0 002.5 6c0 3.2 4.5 7 4.5 7z"/><circle cx="7" cy="6" r="1.5"/></svg>} label="Байршил" value="Shangri-La, 3 давхар" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
          Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирэхийг хүсье.
        </div>
        <button style={{
          width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
          backgroundColor: 'var(--color-primary)', color: '#fff',
          fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)', cursor: 'pointer',
        }}>Ирэхээ мэдэгдэх</button>
      </div>
    </div>
  );
}

/* ——— Template type badge (Image / Video) ——— */
function TypeBadge({ type = 'image' }) {
  const Img = () => <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="1.5" width="9" height="9" rx="2"/><circle cx="4.5" cy="4.5" r="1"/><path d="M10.5 8L8 5.5 3 10.5"/></svg>;
  const Vid = () => <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="2.5" width="7" height="7" rx="1.5"/><path d="M8 5.5L11 3.5v5L8 6.5"/></svg>;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px',
      borderRadius: 99, fontSize: 10, fontWeight: 500,
      backgroundColor: 'rgba(31,29,26,0.65)', color: '#fff', backdropFilter: 'blur(4px)',
    }}>{type === 'video' ? <Vid/> : <Img/>}{type === 'video' ? 'Видео' : 'Зураг'}</span>
  );
}

/* ——— Richer template card for pages (thumb + type + premium) ——— */
function PTemplateCard({ name, category, type = 'image', premium, w = 200, thumbH = 230, deg = 135 }) {
  return (
    <div style={{
      width: w, borderRadius: 'var(--radius-md)', overflow: 'hidden',
      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
      boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
    }}>
      <div style={{
        height: thumbH, background: stripeBg(deg, 0.07), backgroundColor: 'var(--color-bg)',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>загвар preview</span>
        <div style={{ position: 'absolute', top: 8, left: 8 }}><TypeBadge type={type} /></div>
        {premium && <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}>PRO</span>}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{category}</div>
      </div>
    </div>
  );
}

/* ——— Skeleton card (loading) ——— */
function SkeletonCard({ w = 200, thumbH = 230 }) {
  const sk = { backgroundColor: 'var(--color-border-muted)', borderRadius: 6 };
  return (
    <div style={{ width: w, borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
      <div style={{ height: thumbH, ...sk, borderRadius: 0, opacity: 0.6 }}></div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ ...sk, height: 12, width: '70%' }}></div>
        <div style={{ ...sk, height: 10, width: '45%', opacity: 0.6 }}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  stripeBg, PLogo, PublicHeader, MobileHeader, PublicFooter,
  InviteCard, TypeBadge, PTemplateCard, SkeletonCard,
});
