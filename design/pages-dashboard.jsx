/* invites — Pages: Dashboard (desktop + mobile) */

const dbInvites = [
  { name: 'Анужингийн төрсөн өдөр', status: 'published', date: 'Өчигдөр', views: 142, rsvp: 24, deg: 45 },
  { name: 'Б.Болд & М.Сараа хурим', status: 'published', date: '3 хоногийн өмнө', views: 89, rsvp: 56, deg: 120 },
  { name: 'Q3 компанийн арга хэмжээ', status: 'draft', date: '1 цагийн өмнө', views: 0, rsvp: 0, deg: 75 },
];

function InviteRow({ inv, mobile }) {
  const Action = ({ d, danger, label }) => (
    <div title={label} style={{
      width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-surface)',
      color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)', flexShrink: 0,
    }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
    </div>
  );
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: 12,
      backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-muted)',
    }}>
      <div style={{
        width: 44, height: 58, borderRadius: 6, flexShrink: 0,
        background: stripeBg(inv.deg, 0.09), backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border-muted)',
      }}></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <DSStatusBadge status={inv.status} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{inv.date}</span>
          {!mobile && inv.status === 'published' && (
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>· {inv.views} үзэлт · {inv.rsvp} хариу</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Action label="Засах" d="M10 2l2 2-7.5 7.5L2 12l.5-2.5L10 2z" />
        {!mobile && <Action label="Урьдчилан үзэх" d="M7 3C4 3 1.8 5.7 1 7c.8 1.3 3 4 6 4s5.2-2.7 6-4c-.8-1.3-3-4-6-4zM7 9a2 2 0 100-4 2 2 0 000 4z" />}
        <Action label="Линк хуулах" d="M6 8a3 3 0 004 .3l2-2a3 3 0 00-4.2-4.2L6.7 3.2M8 6a3 3 0 00-4-.3l-2 2a3 3 0 004.2 4.2l1.1-1.1" />
        <Action label="Устгах" danger d="M2 4h10M5 4V2.5h4V4M3.5 4l.5 8h6l.5-8" />
      </div>
    </div>
  );
}

function DashboardDesktop() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', display: 'flex', backgroundColor: 'var(--color-bg)', minHeight: 720 }}>
      <div style={{ flexShrink: 0 }}><div style={{ height: '100%' }}>
        {/* sidebar full height */}
        <div style={{
          width: 200, height: '100%', minHeight: 720, padding: '16px 0',
          backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border-muted)',
          display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
        }}>
          <div style={{ padding: '0 16px 20px' }}><PLogo size={24} textSize={14} /></div>
          {[
            { label: 'Хянах самбар', active: true },
            { label: 'Миний урилгууд' },
            { label: 'Загварууд' },
            { label: 'Тохиргоо' },
          ].map((item, i) => (
            <div key={i} style={{
              margin: '0 8px 2px', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              backgroundColor: item.active ? 'var(--color-bg)' : 'transparent',
              color: item.active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: 12, fontWeight: item.active ? 500 : 400,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: item.active ? 'var(--color-accent)' : 'var(--color-border)' }}></span>
              {item.label}
            </div>
          ))}
          <div style={{ flex: 1 }}></div>
          <div style={{ margin: '0 12px', padding: 12, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-accent-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-accent)', marginBottom: 4 }}>Pro болох</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Хязгааргүй урилга, видео экспорт</div>
          </div>
        </div>
      </div></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DSTopbar />
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>Сайн уу, Бат-Эрдэнэ</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Урилгуудаа эндээс удирдаарай</div>
            </div>
            <DSButton variant="accent" icon={<PlusIcon/>}>Шинэ урилга</DSButton>
          </div>
          {/* stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Нийт урилга', value: '8' },
              { label: 'Нийтлэгдсэн', value: '5' },
              { label: 'Ноорог', value: '3' },
              { label: 'Нийт хариу (RSVP)', value: '113' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <DSSectionHeader title="Миний урилгууд" action={
            <div style={{ display: 'flex', gap: 8 }}>
              <DSTabs tabs={['Бүгд', 'Нийтлэгдсэн', 'Ноорог']} activeIndex={0} />
            </div>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {dbInvites.map((inv, i) => <InviteRow key={i} inv={inv} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardEmpty() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Миний урилгууд</div>
        <DSButton variant="accent" icon={<PlusIcon/>}>Шинэ урилга</DSButton>
      </div>
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', padding: '24px 0' }}>
        <DSEmptyState title="Анхны урилгаа үүсгээрэй" description="Загвараа сонгоод хэдхэн минутад гоё урилга бэлдээрэй" action="Урилга үүсгэх" />
      </div>
    </div>
  );
}

function DashboardMobile() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)' }}>
      <MobileHeader title="Хянах самбар" />
      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Нийт урилга', value: '8' },
            { label: 'Хариу (RSVP)', value: '113' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Миний урилгууд</span>
          <DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Шинэ</DSButton>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dbInvites.map((inv, i) => <InviteRow key={i} inv={inv} mobile />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardDesktop, DashboardEmpty, DashboardMobile });
