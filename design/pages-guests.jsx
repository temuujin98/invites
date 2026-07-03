/* invites — Pages: Guest management, RSVP sheet states, invalid link, personalized view, email template */

/* ——— DeliveryBadge alias (uses DSDeliveryBadge from ds-patterns) ——— */

const guestRows = [
  { name: 'О. Сүхбат', email: 'sukhbat@gmail.com', phone: '9911-0001', rsvp: 'yes', count: 2, delivery: 'sent' },
  { name: 'Д. Номин-Эрдэнэ', email: 'nomin.e@gmail.com', phone: '8800-2345', rsvp: 'maybe', count: 1, delivery: 'sent' },
  { name: 'Б. Тэмүүлэн', email: '', phone: '9090-7766', rsvp: 'pending', count: 0, delivery: 'notsent' },
  { name: 'Ц. Сарангэрэл', email: 'saraa@mail.mn', phone: '', rsvp: 'no', count: 0, delivery: 'failed' },
  { name: 'Г. Билгүүн', email: 'bilguun@corp.mn', phone: '9595-1122', rsvp: 'yes', count: 1, delivery: 'sending' },
];

function RSVPBadge({ rsvp }) {
  const conf = {
    yes: { v: 'success', label: 'Ирнэ' },
    no: { v: 'danger', label: 'Ирэхгүй' },
    maybe: { v: 'warning', label: 'Магадгүй' },
    pending: { v: 'default', label: 'Хүлээгдэж буй' },
  }[rsvp];
  return <DSBadge variant={conf.v}>{conf.label}</DSBadge>;
}

function GuestActionBtn({ d, danger, label }) {
  return (
    <div title={label} style={{
      width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-surface)',
      color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)', flexShrink: 0,
    }}>
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
    </div>
  );
}
const gIconSend = 'M12.5 1.5L6.5 7.5M12.5 1.5L8.5 12.5L6.5 7.5M12.5 1.5L1.5 5.5L6.5 7.5';
const gIconLink = 'M6 8a3 3 0 004 .3l2-2a3 3 0 00-4.2-4.2L6.7 3.2M8 6a3 3 0 00-4-.3l-2 2a3 3 0 004.2 4.2l1.1-1.1';
const gIconEdit = 'M10 2l2 2-7.5 7.5L2 12l.5-2.5L10 2z';
const gIconTrash = 'M2 4h10M5 4V2.5h4V4M3.5 4l.5 8h6l.5-8';

/* ——— Guest management page (desktop) ——— */
function GuestManagementDesktop() {
  const stats = [
    { label: 'Нийт зочид', value: 5 },
    { label: 'Ирнэ', value: 2, color: 'var(--color-success)' },
    { label: 'Ирэхгүй', value: 1, color: 'var(--color-danger)' },
    { label: 'Магадгүй', value: 1, color: 'var(--color-warning)' },
    { label: 'Хүлээгдэж буй', value: 1, color: 'var(--color-text-muted)' },
  ];
  const thStyle = { padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.04em' };
  const tdStyle = { padding: '10px 12px', fontSize: 12, borderBottom: '1px solid var(--color-border-muted)', verticalAlign: 'middle' };
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', minHeight: 640 }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 40px 48px' }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Миний урилгууд <span style={{ margin: '0 6px' }}>/</span> Анужингийн төрсөн өдөр <span style={{ margin: '0 6px' }}>/</span> <span style={{ color: 'var(--color-text-secondary)' }}>Зочид</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>Зочид</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Зочдоо нэмж, урилга илгээгээд хариуг нь хянаарай</div>
          </div>
          <DSButton variant="accent" icon={<PlusIcon/>}>Зочин нэмэх</DSButton>
        </div>
        {/* stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color || 'var(--color-text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>
        {/* bulk send bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', marginBottom: 12,
          borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-accent-subtle)', border: '1px solid #DBC9F9',
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-accent)' }}>2 зочин сонгогдсон</span>
          <div style={{ flex: 1 }}></div>
          <DSButton variant="accent" size="sm">Урилга илгээх</DSButton>
          <DSButton variant="ghost" size="sm">Болих</DSButton>
        </div>
        {/* table */}
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 36 }}><DSCheckbox label="" checked /></th>
                <th style={thStyle}>Нэр</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Утас</th>
                <th style={thStyle}>RSVP</th>
                <th style={thStyle}>Илгээлт</th>
                <th style={{ ...thStyle, width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {guestRows.map((g, i) => (
                <tr key={i} style={{ backgroundColor: i < 2 ? 'var(--color-accent-subtle)' : 'transparent' }}>
                  <td style={tdStyle}><DSCheckbox label="" checked={i < 2} /></td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{g.name}{g.rsvp === 'yes' && g.count > 1 ? <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}> +{g.count - 1}</span> : ''}</td>
                  <td style={{ ...tdStyle, color: g.email ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>{g.email || '—'}</td>
                  <td style={{ ...tdStyle, color: g.phone ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>{g.phone || '—'}</td>
                  <td style={tdStyle}><RSVPBadge rsvp={g.rsvp} /></td>
                  <td style={tdStyle}><DSDeliveryBadge status={g.delivery} /></td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <GuestActionBtn d={gIconSend} label={g.delivery === 'failed' ? 'Дахин илгээх' : 'Илгээх'} />
                      <GuestActionBtn d={gIconLink} label="Линк хуулах" />
                      <GuestActionBtn d={gIconEdit} label="Засах" />
                      <GuestActionBtn d={gIconTrash} danger label="Устгах" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ——— Guest management: empty + modal ——— */
function GuestManagementStates() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', padding: 28, display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Empty state</div>
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', padding: '8px 0' }}>
          <DSEmptyState title="Зочин нэмээгүй байна" description="Зочдоо нэмбэл урилга илгээж, хариуг нь нэг дороос хянах боломжтой" action="Зочин нэмэх" />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>GuestFormModal — нэмэх/засах</div>
        <div style={{ width: 360, borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Зочин нэмэх</div>
            <DSInput label="Нэр *" placeholder="Зочны нэр" />
            <DSInput label="Email" placeholder="zochin@mail.mn" helper="Email эсвэл утасны аль нэг нь шаардлагатай" />
            <DSInput label="Утас" placeholder="9911-2233" />
            <DSTextarea label="Тэмдэглэл" placeholder="Жнь: ажлын хамт олон" rows={2} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 24px', borderTop: '1px solid var(--color-border-muted)', marginTop: 8 }}>
            <DSButton variant="ghost">Болих</DSButton>
            <DSButton variant="primary">Хадгалах</DSButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Guest management: mobile (GuestCard list) ——— */
function GuestManagementMobile() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', minHeight: 700 }}>
      <MobileHeader title="Зочид" />
      <div style={{ padding: '14px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[['Нийт', 5], ['Ирнэ', 2, 'var(--color-success)'], ['Хүлээгдэж буй', 1, 'var(--color-text-muted)']].map((s, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s[0]}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s[2] || 'var(--color-text-primary)' }}>{s[1]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}><DSButton variant="accent" icon={<PlusIcon/>} style={{ width: '100%' }}>Зочин нэмэх</DSButton></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {guestRows.slice(0, 4).map((g, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{g.name}</span>
                <RSVPBadge rsvp={g.rsvp} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>{[g.email, g.phone].filter(Boolean).join(' · ') || 'Холбоо барих мэдээлэлгүй'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DSDeliveryBadge status={g.delivery} />
                <div style={{ display: 'flex', gap: 5 }}>
                  <GuestActionBtn d={gIconSend} label="Илгээх" />
                  <GuestActionBtn d={gIconLink} label="Линк" />
                  <GuestActionBtn d={gIconEdit} label="Засах" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— RSVP sheet — static states (form / error / success) ——— */
function RSVPSheetStatic({ state = 'form', prefillName }) {
  const seg = (active) => ['Ирнэ', 'Ирэхгүй', 'Магадгүй'].map((o, i) => (
    <div key={o} style={{
      flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 13, fontWeight: o === active ? 600 : 400,
      backgroundColor: o === active ? 'var(--color-primary)' : 'var(--color-surface)',
      color: o === active ? '#fff' : 'var(--color-text-secondary)',
      borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none', cursor: 'pointer',
    }}>{o}</div>
  ));
  return (
    <div style={{
      width: 360, backgroundColor: 'var(--color-surface)', borderRadius: '20px 20px 0 0',
      padding: '12px 24px 28px', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-family)',
    }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--color-border)', margin: '0 auto 18px' }}></div>
      {state === 'success' ? (
        <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,12.5 10,17.5 19,7"/></svg>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Хариу илгээгдлээ</div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>Баярлалаа, Сүхбат! Таныг 2 хүнтэй ирнэ гэж бүртгэлээ.</div>
          <DSButton variant="secondary" style={{ width: '100%' }}>Хариу засах</DSButton>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>Ирэхээ мэдэгдэх</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18, textAlign: 'center' }}>Бат-Эрдэнэ гэр бүлд хариу илгээнэ</div>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Таны нэр *</div>
          <input readOnly value={prefillName || (state === 'error' ? '' : 'О. Сүхбат')} placeholder="Нэрээ оруулна уу" style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-family)',
            border: `1px solid ${state === 'error' ? 'var(--color-danger)' : 'var(--color-border)'}`,
            boxShadow: state === 'error' ? '0 0 0 3px var(--color-danger-bg)' : 'none',
            borderRadius: 'var(--radius-sm)', outline: 'none', marginBottom: state === 'error' ? 4 : 14,
          }} />
          {state === 'error' && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginBottom: 12 }}>Нэрээ оруулна уу — хэн ирэхийг мэдэхэд хэрэгтэй</div>}
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Ирэх эсэх *</div>
          <div style={{ display: 'flex', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 14 }}>
            {seg(state === 'error' ? null : 'Ирнэ')}
          </div>
          {state !== 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Хэдэн хүн ирэх вэ?</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>−</div>
                <div style={{ width: 36, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>2</div>
                <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>+</div>
              </div>
            </div>
          )}
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Тайлбар <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(заавал биш)</span></div>
          <textarea readOnly placeholder="Жнь: бага зэрэг оройтож очно" style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-family)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none',
            minHeight: 56, resize: 'none', marginBottom: 16,
          }}></textarea>
          <DSButton variant="primary" size="lg" style={{ width: '100%' }}>Хариу илгээх</DSButton>
        </React.Fragment>
      )}
    </div>
  );
}

function RSVPSheetStates() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#EBE7E0', padding: 28, display: 'flex', gap: 24, alignItems: 'flex-end', justifyContent: 'center' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, textAlign: 'center' }}>Form</div>
        <RSVPSheetStatic state="form" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, textAlign: 'center' }}>Validation error</div>
        <RSVPSheetStatic state="error" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, textAlign: 'center' }}>Success</div>
        <RSVPSheetStatic state="success" />
      </div>
    </div>
  );
}

/* ——— Invalid / expired link state ——— */
function InvalidLinkState({ variant = 'notfound' }) {
  const conf = variant === 'archived'
    ? { title: 'Урилга хүчингүй болсон', desc: 'Энэ урилгыг эзэмшигч нь архивласан байна. Шинэ линк хэрэгтэй бол урьсан хүнтэйгээ холбогдоорой.' }
    : { title: 'Урилга олдсонгүй', desc: 'Линк буруу эсвэл урилгын хугацаа дууссан байж магадгүй. Линкээ шалгаад дахин оролдоорой.' };
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#EBE7E0', minHeight: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{
        width: 400, backgroundColor: '#FDFCFA', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border-muted)', padding: '44px 32px 36px', textAlign: 'center',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9l9 5 9-5"/><line x1="3.5" y1="20.5" x2="20.5" y2="3.5"/>
          </svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8 }}>{conf.title}</div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 22 }}>{conf.desc}</div>
        <DSButton variant="secondary">invites.mn рүү очих</DSButton>
      </div>
      <div style={{ marginTop: 24, fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>i</span>
        </div>
        invites.mn — дижитал урилгын платформ
      </div>
    </div>
  );
}

/* ——— Personalized guest view (/g/[token]) ——— */
function PersonalizedGuestView() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#EBE7E0', padding: '20px 14px 28px', minHeight: 780 }}>
      {/* greeting header */}
      <div style={{
        maxWidth: 400, margin: '0 auto 12px', padding: '12px 18px', textAlign: 'center',
        borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(253,252,250,0.75)', border: '1px solid var(--color-border-muted)',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.28em', color: 'var(--color-accent)', fontWeight: 500, marginBottom: 3 }}>ЭРХЭМ ХҮНДЭТ</div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>О. Сүхбат</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Танд хувийн урилга ирлээ</div>
      </div>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <PublicInviteBody />
      </div>
      {/* prefilled RSVP hint */}
      <div style={{ maxWidth: 400, margin: '12px auto 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', backgroundColor: 'rgba(253,252,250,0.75)', padding: '6px 14px', borderRadius: 99, border: '1px solid var(--color-border-muted)' }}>
          RSVP дээр нэр тань урьдчилан бөглөгдсөн байна
        </div>
      </div>
    </div>
  );
}

/* ——— Email invite template (email-safe, single column) ——— */
function EmailInviteTemplate() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#EFEDE9', padding: '28px 16px' }}>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        {/* preheader area */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Танд урилга ирлээ — нээж үзээрэй
        </div>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E1DB' }}>
          {/* header */}
          <div style={{ padding: '18px 24px', textAlign: 'center', borderBottom: '1px solid #EEEAE5' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#8B5CF6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>i</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1F1D1A' }}>invites</span>
            </div>
          </div>
          {/* thumbnail */}
          <div style={{ position: 'relative', height: 180 }}>
            <TplArt kind="birthday" scale={1.3} />
          </div>
          {/* body */}
          <div style={{ padding: '24px 24px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#9E9891', marginBottom: 6 }}>Эрхэм хүндэт О. Сүхбат,</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1F1D1A', lineHeight: 1.25, marginBottom: 6 }}>Анужингийн төрсөн өдөр</div>
            <div style={{ fontSize: 14, color: '#6D6762', lineHeight: 1.55, marginBottom: 18 }}>Бат-Эрдэнэ, Солонго нар таныг урьж байна</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <tbody>
                {[['Огноо', '2026.06.21, Ням'], ['Цаг', '18:00'], ['Байршил', 'Shangri-La Ulaanbaatar, 3 давхар']].map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: '7px 0', fontSize: 12, color: '#9E9891', textAlign: 'left', borderBottom: '1px solid #EEEAE5', width: 80 }}>{r[0]}</td>
                    <td style={{ padding: '7px 0', fontSize: 13, fontWeight: 500, color: '#1F1D1A', textAlign: 'right', borderBottom: '1px solid #EEEAE5' }}>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'block', backgroundColor: '#8B5CF6', borderRadius: 10, padding: '13px 0', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer' }}>
              Урилга нээх
            </div>
            <div style={{ fontSize: 11, color: '#9E9891', marginTop: 14, lineHeight: 1.5 }}>
              Товч ажиллахгүй бол: invites.mn/g/x8kJ2mQt
            </div>
          </div>
        </div>
        {/* footer */}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#9E9891', marginTop: 16, lineHeight: 1.6 }}>
          Энэ урилгыг invites.mn дээр үүсгэсэн<br/>
          <span style={{ textDecoration: 'underline' }}>Мэдэгдэл хүлээн авахаа болих</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  GuestManagementDesktop, GuestManagementStates, GuestManagementMobile,
  RSVPSheetStatic, RSVPSheetStates, InvalidLinkState, PersonalizedGuestView, EmailInviteTemplate,
  RSVPBadge,
});
