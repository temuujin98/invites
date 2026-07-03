/* invite — Design System: Patterns (Badges, Tabs, Stepper, Pagination, Toast, Tooltip) */

const patS = {
  section: { marginBottom: 48 },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 20, letterSpacing: '-0.01em' },
  subTitle: { fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
};

/* ——— Badge ——— */
const badgeStyles = {
  base: { display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 500, lineHeight: 1 },
  default:  { backgroundColor: 'var(--color-bg)',         color: 'var(--color-text-secondary)' },
  primary:  { backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' },
  success:  { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' },
  warning:  { backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  danger:   { backgroundColor: 'var(--color-danger-bg)',  color: 'var(--color-danger)' },
};

function DSBadge({ variant = 'default', children }) {
  return <span style={{ ...badgeStyles.base, ...badgeStyles[variant] }}>{children}</span>;
}

/* ——— Status Badge ——— */
function DSStatusBadge({ status = 'draft', label }) {
  const map = { draft: 'default', active: 'success', published: 'primary', expired: 'warning', cancelled: 'danger', archived: 'default' };
  const labels = { draft: 'Ноорог', active: 'Идэвхтэй', published: 'Нийтлэгдсэн', expired: 'Хугацаа дууссан', cancelled: 'Цуцлагдсан', archived: 'Архивлагдсан' };
  const dotColor = { draft: 'var(--color-text-muted)', active: 'var(--color-success)', published: 'var(--color-accent)', expired: 'var(--color-warning)', cancelled: 'var(--color-danger)', archived: 'var(--color-border)' };
  return (
    <span style={{ ...badgeStyles.base, ...badgeStyles[map[status]], gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColor[status] }}></span>
      {label || labels[status]}
    </span>
  );
}

/* ——— Delivery Status Badge ——— */
function DSDeliveryBadge({ status = 'notsent' }) {
  const conf = {
    notsent: { v: 'default', label: 'Илгээгээгүй', dot: 'var(--color-text-muted)' },
    sending: { v: 'primary', label: 'Илгээж байна', dot: 'var(--color-accent)', pulse: true },
    sent:    { v: 'success', label: 'Илгээсэн', dot: 'var(--color-success)' },
    failed:  { v: 'danger',  label: 'Амжилтгүй', dot: 'var(--color-danger)' },
  }[status];
  return (
    <span style={{ ...badgeStyles.base, ...badgeStyles[conf.v], gap: 5 }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', backgroundColor: conf.dot,
        animation: conf.pulse ? 'dsLoadPulse 1.1s ease-in-out infinite' : 'none',
      }}></span>
      {conf.label}
    </span>
  );
}

/* ——— Category Chip ——— */
function DSCategoryChip({ label, active, icon }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
      fontFamily: 'var(--font-family)',
      backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
      color: active ? '#fff' : 'var(--color-text-secondary)',
      border: active ? 'none' : '1px solid var(--color-border)',
      cursor: 'pointer',
      transition: 'all var(--duration-normal) var(--ease-out)',
    }}>{icon}{label}</button>
  );
}

/* ——— Tabs ——— */
function DSTabs({ tabs = [], activeIndex = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border-muted)' }}>
      {tabs.map((t, i) => (
        <div key={i} style={{
          padding: '8px 16px', fontSize: 12, fontWeight: i === activeIndex ? 500 : 400,
          color: i === activeIndex ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          borderBottom: i === activeIndex ? '2px solid var(--color-accent)' : '2px solid transparent',
          cursor: 'pointer', transition: 'all var(--duration-normal) var(--ease-out)',
          marginBottom: -1,
        }}>{t}</div>
      ))}
    </div>
  );
}

/* ——— Stepper ——— */
function DSStepper({ steps = [], currentStep = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                backgroundColor: done ? 'var(--color-primary)' : active ? 'var(--color-accent)' : 'var(--color-bg)',
                color: done || active ? '#fff' : 'var(--color-text-muted)',
                border: !done && !active ? '1.5px solid var(--color-border)' : 'none',
                transition: 'all var(--duration-slow) var(--ease-out)',
              }}>{done ? <CheckIcon/> : i + 1}</div>
              <div style={{
                fontSize: 12, fontWeight: active ? 500 : 400,
                color: active ? 'var(--color-text-primary)' : done ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
              }}>{s}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 32, height: 1.5, margin: '0 8px',
                backgroundColor: done ? 'var(--color-primary)' : 'var(--color-border-muted)',
                borderRadius: 1,
              }}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ——— Pagination ——— */
function DSPagination({ current = 1, total = 5 }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const ArrowL = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 9L4.5 6L7.5 3"/></svg>;
  const ArrowR = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3L7.5 6L4.5 9"/></svg>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button style={{ ...pgBtn, opacity: current === 1 ? 0.3 : 1 }}><ArrowL/></button>
      {pages.map(p => (
        <button key={p} style={{
          ...pgBtn,
          backgroundColor: p === current ? 'var(--color-primary)' : 'transparent',
          color: p === current ? '#fff' : 'var(--color-text-secondary)',
        }}>{p}</button>
      ))}
      <button style={{ ...pgBtn, opacity: current === total ? 0.3 : 1 }}><ArrowR/></button>
    </div>
  );
}
const pgBtn = {
  width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-family)',
  cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
  transition: 'all var(--duration-fast)',
};

/* ——— Toast ——— */
const toastIcons = {
  success: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="var(--color-success-bg)" stroke="var(--color-success)" strokeWidth="1.2"/><polyline points="5,8 7,10.5 11,5.5" fill="none" stroke="var(--color-success)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="var(--color-warning-bg)" stroke="var(--color-warning)" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="var(--color-warning)" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="10.8" r="0.7" fill="var(--color-warning)"/></svg>,
  danger: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="var(--color-danger-bg)" stroke="var(--color-danger)" strokeWidth="1.2"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="var(--color-danger)" strokeWidth="1.4" strokeLinecap="round"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="var(--color-danger)" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth="1.2"/><circle cx="8" cy="5.2" r="0.7" fill="var(--color-accent)"/><line x1="8" y1="7.5" x2="8" y2="11" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round"/></svg>,
};

function DSToast({ variant = 'success', message }) {
  const msgs = { success: 'Амжилттай хадгалагдлаа', warning: 'Хугацаа дуусах гэж байна', danger: 'Алдаа гарлаа', info: 'Шинэ загвар нэмэгдлээ' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
      backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-muted)',
      maxWidth: 320,
    }}>
      {toastIcons[variant]}
      <span style={{ fontSize: 12, color: 'var(--color-text-primary)', flex: 1 }}>{message || msgs[variant]}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round" style={{ cursor: 'pointer', flexShrink: 0 }}><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>
    </div>
  );
}

/* ——— Tooltip ——— */
function DSTooltip({ text = 'Тусламж текст', children }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        padding: '5px 10px', borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-primary)', color: '#fff',
        fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
        boxShadow: 'var(--shadow-sm)',
      }}>{text}</div>
      <div style={{ width: 8, height: 4, overflow: 'hidden', marginTop: -6 }}>
        <div style={{ width: 8, height: 8, backgroundColor: 'var(--color-primary)', transform: 'rotate(45deg)', transformOrigin: 'top left', marginLeft: 4 }}></div>
      </div>
      {children}
    </div>
  );
}

/* ——— Dropdown Menu ——— */
function DSDropdownMenu() {
  const items = ['Засварлах', 'Хуулах', 'Хуваалцах', null, 'Устгах'];
  return (
    <div style={{
      width: 180, padding: '4px 0',
      backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border-muted)',
    }}>
      {items.map((item, i) => item === null
        ? <div key={i} style={{ height: 1, backgroundColor: 'var(--color-border-muted)', margin: '4px 8px' }}></div>
        : <div key={i} style={{
            padding: '7px 12px', fontSize: 12,
            color: item === 'Устгах' ? 'var(--color-danger)' : 'var(--color-text-primary)',
            cursor: 'pointer',
          }}>{item}</div>
      )}
    </div>
  );
}

/* ——— Showcase ——— */
function PatternsShowcase() {
  return (
    <div>
      <div style={patS.section}>
        <div style={patS.title}>Badges & Status</div>
        <div style={patS.row}>
          <DSBadge>Default</DSBadge>
          <DSBadge variant="primary">Шинэ</DSBadge>
          <DSBadge variant="success">Амжилттай</DSBadge>
          <DSBadge variant="warning">Анхааруулга</DSBadge>
          <DSBadge variant="danger">Алдаа</DSBadge>
        </div>
        <div style={{ ...patS.subTitle, marginTop: 16 }}>Status Badges</div>
        <div style={patS.row}>
          <DSStatusBadge status="draft" />
          <DSStatusBadge status="active" />
          <DSStatusBadge status="published" />
          <DSStatusBadge status="expired" />
          <DSStatusBadge status="cancelled" />
          <DSStatusBadge status="archived" />
        </div>
        <div style={{ ...patS.subTitle, marginTop: 16 }}>Delivery Badges — илгээлтийн төлөв</div>
        <div style={patS.row}>
          <DSDeliveryBadge status="notsent" />
          <DSDeliveryBadge status="sending" />
          <DSDeliveryBadge status="sent" />
          <DSDeliveryBadge status="failed" />
        </div>
        <div style={{ ...patS.subTitle, marginTop: 16 }}>Category Chips</div>
        <div style={patS.row}>
          <DSCategoryChip label="Бүгд" active />
          <DSCategoryChip label="Төрсөн өдөр" />
          <DSCategoryChip label="Хурим" />
          <DSCategoryChip label="Корпоратив" />
          <DSCategoryChip label="Хүүхдийн баяр" />
          <DSCategoryChip label="Нээлт" />
        </div>
      </div>

      <div style={patS.section}>
        <div style={patS.title}>Tabs</div>
        <DSTabs tabs={['Бүгд', 'Идэвхтэй', 'Ноорог', 'Архив']} activeIndex={0} />
        <div style={{ marginTop: 16 }}>
          <DSTabs tabs={['Мэдээлэл', 'Загвар', 'Урьдчилсан харах', 'Хуваалцах']} activeIndex={2} />
        </div>
      </div>

      <div style={patS.section}>
        <div style={patS.title}>Stepper</div>
        <div style={{ marginBottom: 16 }}>
          <DSStepper steps={['Загвар', 'Мэдээлэл', 'Засварлах', 'Хуваалцах']} currentStep={1} />
        </div>
        <DSStepper steps={['Загвар', 'Мэдээлэл', 'Засварлах', 'Хуваалцах']} currentStep={3} />
      </div>

      <div style={patS.section}>
        <div style={patS.title}>Pagination</div>
        <div style={patS.row}>
          <DSPagination current={3} total={7} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <div style={patS.section}>
          <div style={patS.title}>Toast Notifications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <DSToast variant="success" />
            <DSToast variant="warning" />
            <DSToast variant="danger" />
            <DSToast variant="info" />
          </div>
        </div>
        <div style={patS.section}>
          <div style={patS.title}>Tooltip</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 8 }}>
            <DSTooltip text="Хуулах">
              <DSButton variant="secondary" size="sm">Hover target</DSButton>
            </DSTooltip>
            <DSTooltip text="Устгах боломжгүй">
              <DSButton variant="ghost" size="sm" disabled>Disabled</DSButton>
            </DSTooltip>
          </div>
        </div>
        <div style={patS.section}>
          <div style={patS.title}>Dropdown Menu</div>
          <DSDropdownMenu />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DSBadge, DSStatusBadge, DSDeliveryBadge, DSCategoryChip, DSTabs, DSStepper, DSPagination,
  DSToast, DSTooltip, DSDropdownMenu, PatternsShowcase,
});
