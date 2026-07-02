/* invites — Admin: shared chrome (AdminShell, sidebar, topbar, table primitives) */

function AIc({ d, size = 14, sw = 1.4 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
}

const adminIcons = {
  dash: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  templates: 'M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zM2 6h12M6 6v8',
  invites: 'M2 4.5h12v8H2zM2 5l6 4 6-4',
  categories: 'M2 3h5l1.5 2H14v8H2V3z',
  assets: 'M2 3h12v10H2zM2 10l3.5-3 3 2.5L11 7l3 3M5.5 6.5a1 1 0 100-2 1 1 0 000 2z',
  settings: 'M8 10a2 2 0 100-4 2 2 0 000 4zM13.3 9.7a1.2 1.2 0 00.24 1.32l.04.04a1.45 1.45 0 11-2.05 2.05l-.04-.04a1.2 1.2 0 00-1.32-.24 1.2 1.2 0 00-.73 1.1v.12a1.45 1.45 0 11-2.9 0v-.06A1.2 1.2 0 005.8 12.9a1.2 1.2 0 00-1.32.24l-.04.04a1.45 1.45 0 11-2.05-2.05l.04-.04a1.2 1.2 0 00.24-1.32',
  plus: 'M8 3v10M3 8h10',
  upload: 'M8 11V3M4.5 6.5L8 3l3.5 3.5M3 11v1.5A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V11',
  edit: 'M11.5 2.5l2 2L6 12l-2.7.7L4 10l7.5-7.5z',
  copy: 'M5.5 5.5h7v7h-7zM10.5 5.5V3.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2',
  eye: 'M8 3.5C4.5 3.5 2 6.5 1.2 8c.8 1.5 3.3 4.5 6.8 4.5s6-3 6.8-4.5C14 6.5 11.5 3.5 8 3.5zM8 10a2 2 0 100-4 2 2 0 000 4z',
  globe: 'M8 14.5A6.5 6.5 0 108 1.5a6.5 6.5 0 000 13zM1.5 8h13M8 1.5c1.8 1.8 2.5 4 2.5 6.5S9.8 12.7 8 14.5C6.2 12.7 5.5 10.5 5.5 8S6.2 3.3 8 1.5z',
  trash: 'M2.5 4.5h11M6 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5M4 4.5l.7 9h6.6l.7-9',
  search: 'M7 12a5 5 0 100-10 5 5 0 000 10zM14 14l-3.5-3.5',
  grid: 'M2 2h5.5v5.5H2zM8.5 2H14v5.5H8.5zM2 8.5h5.5V14H2zM8.5 8.5H14V14H8.5z',
  list: 'M2 3.5h12M2 8h12M2 12.5h12',
  text: 'M3 3.5h10M8 3.5V13M5.5 13h5',
  date: 'M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 1.5v3M10.5 1.5v3',
  clock: 'M8 14.5A6.5 6.5 0 108 1.5a6.5 6.5 0 000 13zM8 4.5V8l2.5 1.5',
  pin: 'M8 14.5s4.5-4 4.5-7.5a4.5 4.5 0 00-9 0c0 3.5 4.5 7.5 4.5 7.5zM8 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  photo: 'M2 3h12v10H2zM2 10l3.5-3 3 2.5L11 7l3 3M5.5 6.5a1 1 0 100-2 1 1 0 000 2z',
  qr: 'M2 2h4.5v4.5H2zM9.5 2H14v4.5H9.5zM2 9.5h4.5V14H2zM9.5 9.5h2v2h-2zM12.5 12.5H14V14h-1.5M9.5 13.5v.5',
  rsvp: 'M2 4.5h12v8H2zM2 5l6 4 6-4',
  lock: 'M4.5 7V5a3.5 3.5 0 117 0v2M3.5 7h9v7h-9z',
  unlock: 'M4.5 7V5a3.5 3.5 0 016.8-1M3.5 7h9v7h-9z',
  drag: 'M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01',
  video: 'M2 4h8.5v8H2zM10.5 7l3.5-2.5v7L10.5 9',
  image: 'M2 3h12v10H2zM2 10l3.5-3 3 2.5L11 7l3 3',
  link: 'M6.5 9.5a3 3 0 004.2.3l2-2a3 3 0 00-4.2-4.2l-1 1M9.5 6.5a3 3 0 00-4.2-.3l-2 2a3 3 0 004.2 4.2l1-1',
  warn: 'M8 2L1.5 13.5h13L8 2zM8 6.5V10M8 11.8v.2',
  x: 'M4 4l8 8M12 4l-8 8',
  check: 'M3 8.5L6.5 12L13 4.5',
  chevD: 'M4 6.5L8 10.5L12 6.5',
};

/* ——— AdminShell: dark sidebar + topbar + content ——— */
function AdminShell({ active = 'Хянах самбар', title, crumb, actions, children, minHeight = 760 }) {
  const navItems = [
    { label: 'Хянах самбар', icon: adminIcons.dash },
    { label: 'Загварууд', icon: adminIcons.templates },
    { label: 'Урилгууд', icon: adminIcons.invites },
    { label: 'Илгээлтийн лог', icon: adminIcons.send || adminIcons.invites },
    { label: 'Ангилал', icon: adminIcons.categories },
    { label: 'Файлын сан', icon: adminIcons.assets },
    { label: 'Тохиргоо', icon: adminIcons.settings },
  ];
  return (
    <div style={{ display: 'flex', fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', minHeight }}>
      {/* Dark sidebar */}
      <div style={{
        width: 196, flexShrink: 0, backgroundColor: 'var(--color-primary)',
        display: 'flex', flexDirection: 'column', padding: '16px 0',
      }}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>i</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>invites</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: '#CBB8F7', padding: '2px 6px', borderRadius: 4 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
          {navItems.map((item, i) => {
            const on = item.label === active;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                backgroundColor: on ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: on ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 12, fontWeight: on ? 500 : 400,
              }}>
                <AIc d={item.icon} />
                {item.label}
                {on && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></span>}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#fff' }}>А</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>Админ</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>admin@invites.mn</div>
          </div>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          height: 52, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            {crumb && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{crumb} /</span>}
            <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>
        </div>
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

/* ——— Generic admin table ——— */
function ATable({ head, children }) {
  return (
    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} style={{
                padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)',
                textAlign: h.right ? 'right' : 'left', borderBottom: '1px solid var(--color-border)',
                textTransform: 'uppercase', letterSpacing: '0.04em', width: h.w,
              }}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function ATd({ children, right, muted, style: sx }) {
  return <td style={{
    padding: '10px 12px', fontSize: 12, borderBottom: '1px solid var(--color-border-muted)',
    textAlign: right ? 'right' : 'left',
    color: muted ? 'var(--color-text-secondary)' : 'var(--color-text-primary)', ...sx,
  }}>{children}</td>;
}

/* ——— Row action icon button ——— */
function ARowAction({ icon, danger, title }) {
  return (
    <div title={title} style={{
      width: 26, height: 26, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-surface)',
      color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)',
    }}><AIc d={icon} size={13} /></div>
  );
}

/* ——— Mini thumbnail ——— */
function AThumb({ deg = 45, w = 36, h = 48, r = 6 }) {
  return <div style={{
    width: w, height: h, borderRadius: r, flexShrink: 0,
    background: stripeBg(deg, 0.09), backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border-muted)',
  }}></div>;
}

/* ——— Stat card ——— */
function AStat({ label, value, sub, accent }) {
  return (
    <div style={{
      flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { AIc, adminIcons, AdminShell, ATable, ATd, ARowAction, AThumb, AStat });
