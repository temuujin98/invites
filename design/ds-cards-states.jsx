/* invite — Design System: Cards, States, Modal, Headers */

const crdS = {
  section: { marginBottom: 48 },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 20, letterSpacing: '-0.01em' },
  subTitle: { fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
};

/* ——— Template Card ——— */
function DSTemplateCard({ name, category, premium, selected }) {
  const stripes = (i) => `repeating-linear-gradient(${45 + i * 30}deg, transparent, transparent 8px, rgba(139,92,246,${0.06 + i*0.02}) 8px, rgba(139,92,246,${0.06 + i*0.02}) 9px)`;
  return (
    <div style={{
      width: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden',
      backgroundColor: 'var(--color-surface)',
      border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border-muted)',
      boxShadow: selected ? '0 0 0 3px var(--color-accent-subtle)' : 'var(--shadow-xs)',
      cursor: 'pointer', transition: 'all var(--duration-normal) var(--ease-out)',
    }}>
      <div style={{
        height: 200, background: stripes(Math.random()*3|0),
        backgroundColor: 'var(--color-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>загвар preview</span>
        {premium && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
            backgroundColor: 'var(--color-accent)', color: '#fff',
          }}>PRO</span>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{category}</div>
      </div>
    </div>
  );
}

/* ——— Event Type Card ——— */
const eventIcons = {
  birthday: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 8V4"/><circle cx="12" cy="3" r="1" fill="var(--color-accent)" stroke="none"/><rect x="4" y="10" width="16" height="10" rx="3"/><path d="M4 14h16"/><path d="M8 10V8a2 2 0 014 0v2"/><path d="M12 10V8a2 2 0 014 0v2"/></svg>,
  wedding: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M12 21C12 21 4 15 4 9.5C4 6.5 6.5 4 9 4c1.5 0 2.5.8 3 1.5C12.5 4.8 13.5 4 15 4c2.5 0 5 2.5 5 5.5C20 15 12 21 12 21z"/></svg>,
  corporate: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  opening: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
};

function DSEventTypeCard({ type = 'birthday', label, count, active }) {
  const icons = { birthday: eventIcons.birthday, wedding: eventIcons.wedding, corporate: eventIcons.corporate, opening: eventIcons.opening };
  return (
    <div style={{
      width: 140, padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center',
      backgroundColor: active ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
      border: active ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border-muted)',
      cursor: 'pointer', transition: 'all var(--duration-normal) var(--ease-out)',
    }}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{icons[type]}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{label}</div>
      {count != null && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{count} загвар</div>}
    </div>
  );
}

/* ——— Pricing Card ——— */
function DSPricingCard({ name, price, period, features = [], popular, cta }) {
  return (
    <div style={{
      width: 220, padding: 24, borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--color-surface)',
      border: popular ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border-muted)',
      boxShadow: popular ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      position: 'relative',
    }}>
      {popular && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 12px', borderRadius: 99, fontSize: 10, fontWeight: 600,
          backgroundColor: 'var(--color-accent)', color: '#fff',
        }}>Түгээмэл</div>
      )}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>{price}</span>
        {period && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>/{period}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,7 6,10 11,4"/></svg>
            {f}
          </div>
        ))}
      </div>
      <DSButton variant={popular ? 'accent' : 'secondary'} style={{ width: '100%' }}>{cta || 'Сонгох'}</DSButton>
    </div>
  );
}

/* ——— Share Link Card ——— */
function DSShareLinkCard() {
  const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="4.5" y="4.5" width="7" height="7" rx="1.5"/><path d="M9.5 4.5V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5A1.5 1.5 0 003 9.5h1.5"/></svg>;
  return (
    <div style={{
      padding: 16, borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
      maxWidth: 360,
    }}>
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Хуваалцах холбоос</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px 6px 12px', borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>invites.mn/e/x8kJ2mQ</span>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
          borderRadius: 6, border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff',
          fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-family)',
        }}><CopyIcon/> Хуулах</button>
      </div>
    </div>
  );
}

/* ——— QR Preview ——— */
function DSQRPreview() {
  return (
    <div style={{
      width: 160, padding: 16, borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 100, height: 100, margin: '0 auto 10px',
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg)',
        display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridTemplateRows: 'repeat(7,1fr)', gap: 2, padding: 8,
      }}>
        {Array.from({length: 49}).map((_, i) => (
          <div key={i} style={{
            borderRadius: 1.5,
            backgroundColor: [0,1,2,4,5,6,7,14,21,28,35,42,43,44,46,47,48,2+7,4+7*2,6+7*3,3+7*4,5+7*5,1+7*6].includes(i)
              ? 'var(--color-primary)' : 'transparent',
          }}></div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>QR код</div>
    </div>
  );
}

/* ——— Empty State ——— */
function DSEmptyState({ title = 'Урилга олдсонгүй', description = 'Шинэ урилга үүсгэж эхлээрэй', action }) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center', maxWidth: 320, margin: '0 auto',
    }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 16px', borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9l9 5 9-5"/>
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>{description}</div>
      {action && <DSButton variant="primary" icon={<PlusIcon/>}>{action}</DSButton>}
    </div>
  );
}

/* ——— Loading State ——— */
function DSLoadingState() {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-accent)',
            animation: `dsLoadPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}></div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Уншиж байна...</div>
    </div>
  );
}

/* ——— Error State ——— */
function DSErrorState({ message = 'Алдаа гарлаа. Дахин оролдоно уу.' }) {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center', maxWidth: 320, margin: '0 auto' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 16px', borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>Алдаа</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>{message}</div>
      <DSButton variant="secondary">Дахин оролдох</DSButton>
    </div>
  );
}

/* ——— Modal ——— */
function DSModal({ title = 'Устгах уу?', description, children }) {
  return (
    <div style={{
      width: 360, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)',
    }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>{title}</div>
        {description && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{description}</div>}
        {children}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 24px', borderTop: '1px solid var(--color-border-muted)', marginTop: 16 }}>
        <DSButton variant="ghost">Болих</DSButton>
        <DSButton variant="danger">Устгах</DSButton>
      </div>
    </div>
  );
}

/* ——— Page Header & Section Header ——— */
function DSPageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid var(--color-border-muted)',
      marginBottom: 20,
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function DSSectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</div>
      {action}
    </div>
  );
}

/* ——— Showcase ——— */
function CardsStatesShowcase() {
  return (
    <div>
      <div style={crdS.section}>
        <div style={crdS.title}>Template Cards</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <DSTemplateCard name="Хаврын урилга" category="Төрсөн өдөр" />
          <DSTemplateCard name="Алтан намар" category="Хурим" premium />
          <DSTemplateCard name="Цэцэгс" category="Хүүхдийн баяр" selected />
        </div>
      </div>

      <div style={crdS.section}>
        <div style={crdS.title}>Event Type Cards</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <DSEventTypeCard type="birthday" label="Төрсөн өдөр" count={24} active />
          <DSEventTypeCard type="wedding" label="Хурим" count={18} />
          <DSEventTypeCard type="corporate" label="Корпоратив" count={12} />
          <DSEventTypeCard type="opening" label="Нээлт" count={8} />
        </div>
      </div>

      <div style={crdS.section}>
        <div style={crdS.title}>Pricing Cards</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <DSPricingCard name="Үнэгүй" price="₮0" features={['3 урилга/сар','Үндсэн загварууд','Хуваалцах холбоос']} cta="Эхлэх" />
          <DSPricingCard name="Стандарт" price="₮9,900" period="сар" popular features={['Хязгааргүй урилга','Бүх загварууд','QR код','Зураг оруулах','Видео экспорт']} />
          <DSPricingCard name="Бизнес" price="₮29,900" period="сар" features={['Стандарт+','Брэнд тохиргоо','API хандалт','Тусгай загвар','Дэмжлэг']} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={crdS.section}>
          <div style={crdS.title}>Share & QR</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <DSShareLinkCard />
            <DSQRPreview />
          </div>
        </div>
        <div style={crdS.section}>
          <div style={crdS.title}>Modal</div>
          <DSModal title="Урилга устгах уу?" description="Энэ үйлдлийг буцаах боломжгүй. Таны урилга болон бүх холбоотой мэдээлэл устгагдана." />
        </div>
      </div>

      <div style={crdS.section}>
        <div style={crdS.title}>Page & Section Headers</div>
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '0 24px', border: '1px solid var(--color-border-muted)' }}>
          <DSPageHeader title="Миний урилгууд" subtitle="Нийт 12 урилга" action={<DSButton variant="primary" icon={<PlusIcon/>}>Шинэ урилга</DSButton>} />
          <DSSectionHeader title="Сүүлд засварласан" action={<DSButton variant="ghost" size="sm">Бүгдийг харах<ChevronIcon/></DSButton>} />
          <div style={{ height: 40 }}></div>
        </div>
      </div>

      <div style={crdS.section}>
        <div style={crdS.title}>Feedback States</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            <DSEmptyState action="Урилга үүсгэх" />
          </div>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            <DSLoadingState />
          </div>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            <DSErrorState />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DSTemplateCard, DSEventTypeCard, DSPricingCard, DSShareLinkCard, DSQRPreview,
  DSEmptyState, DSLoadingState, DSErrorState, DSModal, DSPageHeader, DSSectionHeader,
  CardsStatesShowcase,
});
