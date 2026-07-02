/* invites — Prototype: dashboard + guest view */

/* ——— Dashboard ——— */
function ProtoDashboard() {
  const { nav, toast, invites, setInvites, invite } = useProto();
  const [confirmDel, setConfirmDel] = React.useState(null);
  const [tab, setTab] = React.useState('Бүгд');
  const tabs = ['Бүгд', 'Ноорог', 'Нийтэлсэн', 'Архив'];
  const tabFilter = { 'Бүгд': () => true, 'Ноорог': i => i.status === 'draft', 'Нийтэлсэн': i => i.status === 'published', 'Архив': i => i.status === 'archived' };
  const visible = invites.filter(tabFilter[tab]);

  const archive = (inv) => {
    setInvites(list => list.map(x => x.id === inv.id ? { ...x, status: 'archived' } : x));
    toast('Урилга архивлагдлаа — public линк хүчингүй боллоо', 'info');
  };

  const del = () => {
    setInvites(list => list.filter(x => x.id !== confirmDel.id));
    setConfirmDel(null);
    toast('Урилга устгагдлаа', 'success');
  };

  const Action = ({ d, danger, label, onClick }) => (
    <div title={label} onClick={onClick} style={{
      width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: 'var(--color-surface)',
      color: danger ? 'var(--color-danger)' : 'var(--color-text-secondary)', flexShrink: 0,
      transition: 'background-color 200ms ease-out',
    }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
    </div>
  );

  const published = invites.filter(i => i.status === 'published').length;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh' }}>
      <ProtoHeader />
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Сайн уу, Бат-Эрдэнэ</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Урилгуудаа эндээс удирдаарай</div>
          </div>
          <span onClick={() => nav('templates')}><DSButton variant="accent" icon={<PlusIcon/>}>Шинэ урилга</DSButton></span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Нийт урилга', value: invites.length },
            { label: 'Нийтлэгдсэн', value: published },
            { label: 'Ноорог', value: invites.length - published },
            { label: 'Нийт хариу (RSVP)', value: invites.reduce((s, i) => s + i.rsvp, 0) },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <DSSectionHeader title="Миний урилгууд" />
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border-muted)', marginBottom: 12 }}>
          {tabs.map(t => (
            <div key={t} onClick={() => setTab(t)} style={{
              padding: '8px 16px', fontSize: 12, fontWeight: t === tab ? 500 : 400, cursor: 'pointer',
              color: t === tab ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              borderBottom: t === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 180ms ease-out',
            }}>{t}{t === 'Архив' && invites.some(i => i.status === 'archived') ? ` (${invites.filter(i => i.status === 'archived').length})` : ''}</div>
          ))}
        </div>
        {visible.length === 0 && invites.length > 0 ? (
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)', padding: '28px 0', textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)' }}>
            Энэ төлөвт урилга алга
          </div>
        ) : invites.length === 0 ? (
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', padding: '16px 0', animation: 'protoStepIn 240ms ease-out' }}>
            <div style={{ padding: '32px 24px', textAlign: 'center', maxWidth: 320, margin: '0 auto' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9l9 5 9-5"/></svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Анхны урилгаа үүсгээрэй</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Загвараа сонгоод хэдхэн минутад гоё урилга бэлдээрэй</div>
              <span onClick={() => nav('templates')}><DSButton variant="primary" icon={<PlusIcon/>}>Урилга үүсгэх</DSButton></span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {visible.map(inv => {
              const tpl = protoTemplates.find(t => t.id === inv.tplId) || protoTemplates[0];
              return (
                <div key={inv.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 12,
                  backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-muted)', animation: 'protoStepIn 240ms ease-out',
                }}>
                  <div style={{ position: 'relative', width: 44, height: 58, borderRadius: 6, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-muted)' }}>
                    <TplArt kind={tpl.art} scale={0.28} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <DSStatusBadge status={inv.status} />
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{inv.date}{inv.status === 'published' ? ` · ${inv.views} үзэлт · ${inv.rsvp} хариу` : ''}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Action label="Засах" d="M10 2l2 2-7.5 7.5L2 12l.5-2.5L10 2z" onClick={() => nav('create', { tpl: inv.tplId })} />
                    <Action label={inv.status === 'archived' ? 'Хүчингүй линк үзэх' : 'Урьдчилан үзэх'} d="M7 3C4 3 1.8 5.7 1 7c.8 1.3 3 4 6 4s5.2-2.7 6-4c-.8-1.3-3-4-6-4zM7 9a2 2 0 100-4 2 2 0 000 4z" onClick={() => nav(inv.status === 'archived' ? 'invalid' : 'guest')} />
                    <Action label="Линк хуулах" d="M6 8a3 3 0 004 .3l2-2a3 3 0 00-4.2-4.2L6.7 3.2M8 6a3 3 0 00-4-.3l-2 2a3 3 0 004.2 4.2l1.1-1.1" onClick={() => toast(inv.status === 'archived' ? 'Анхаар: архивлагдсан урилгын линк хүчингүй' : 'Линк хуулагдлаа', inv.status === 'archived' ? 'warning' : 'success')} />
                    {inv.status !== 'archived' && <Action label="Архивлах" d="M1.5 3h11v2.5h-11zM2.5 5.5h9V12a1 1 0 01-1 1h-7a1 1 0 01-1-1V5.5zM5.5 8h3" onClick={() => archive(inv)} />}
                    <Action label="Устгах" danger d="M2 4h10M5 4V2.5h4V4M3.5 4l.5 8h6l.5-8" onClick={() => setConfirmDel(inv)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ProtoModal
        open={!!confirmDel}
        title="Урилга устгах уу?"
        desc={confirmDel ? `«${confirmDel.title}» болон бүх холбоотой мэдээлэл бүрмөсөн устана. Энэ үйлдлийг буцаах боломжгүй.` : ''}
        confirmLabel="Устгах" danger
        onConfirm={del} onCancel={() => setConfirmDel(null)}
      />
    </div>
  );
}

/* ——— Guest view (mobile-style centered) ——— */
function ProtoGuest() {
  const { nav, toast, invite } = useProto();
  const [rsvpOpen, setRsvpOpen] = React.useState(false);
  const [rsvp, setRsvp] = React.useState(null); // 'yes' | 'no' | 'maybe'
  const [shareOpen, setShareOpen] = React.useState(false);
  // RSVP form state
  const [rName, setRName] = React.useState('');
  const [rChoice, setRChoice] = React.useState(null);
  const [rCount, setRCount] = React.useState(1);
  const [rNote, setRNote] = React.useState('');
  const [rErr, setRErr] = React.useState({});
  const [rDone, setRDone] = React.useState(false);

  const submitRsvp = () => {
    const e = {};
    if (!rName.trim()) e.name = 'Нэрээ оруулна уу — хэн ирэхийг мэдэхэд хэрэгтэй';
    if (!rChoice) e.choice = 'Ирэх эсэхээ сонгоно уу';
    setRErr(e);
    if (Object.keys(e).length) return;
    setRDone(true);
    setRsvp(rChoice);
  };
  const closeRsvp = () => { setRsvpOpen(false); setRDone(false); setRErr({}); };

  const GA = ({ icon, label, primary, success, onClick }) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      width: '100%', padding: '12px 0', borderRadius: 12,
      border: primary || success ? 'none' : '1px solid var(--color-border)',
      backgroundColor: success ? 'var(--color-success)' : primary ? 'var(--color-primary)' : 'var(--color-surface)',
      color: primary || success ? '#fff' : 'var(--color-text-primary)',
      fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-family)', cursor: 'pointer',
      transition: 'all 200ms ease-out',
    }}>{icon}{label}</button>
  );

  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#EBE7E0', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '32px 0 80px' }}>
      <div style={{ width: 400, position: 'relative' }}>
        <div style={{ backgroundColor: '#FDFCFA', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ position: 'relative', height: 190 }}>
            <TplArt kind="birthday" scale={1.4} />
            <div style={{
              position: 'absolute', bottom: -44, left: '50%', transform: 'translateX(-50%)',
              width: 92, height: 92, borderRadius: '50%', overflow: 'hidden',
              border: '3px solid #FDFCFA', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-bg)',
            }}>
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + invite.photoZoom / 100})`, background: 'radial-gradient(circle at 38% 32%, #E9DDF8 0%, #C9A86A 55%, #8B6F44 100%)' }}></div>
            </div>
          </div>
          <div style={{ padding: '58px 24px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.32em', color: 'var(--color-accent)', fontWeight: 500, marginBottom: 12 }}>ТАНЫГ УРЬЖ БАЙНА</div>
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 6 }}>{invite.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 22 }}>{invite.host} урьж байна</div>
            <div style={{
              borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)',
              backgroundColor: 'var(--color-surface)', padding: 16, marginBottom: 16, textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {[
                { icon: <CalendarIcon/>, label: 'Огноо', value: `${invite.date}, Ням` },
                { icon: <ClockIcon/>, label: 'Цаг', value: `${invite.time} — 22:00` },
                { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14.5s5-4.2 5-7.8A5 5 0 003 6.7c0 3.6 5 7.8 5 7.8z"/><circle cx="8" cy="6.8" r="1.8"/></svg>, label: 'Байршил', value: invite.venue, sub: invite.address },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.value}</div>
                    {r.sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{r.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20, padding: '0 8px' }}>{invite.note}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <GA
                icon={rsvp === 'yes' ? <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,8.5 6.5,12 13,4.5"/></svg> : <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4.5h12v8H2z"/><path d="M2 5l6 4 6-4"/></svg>}
                label={rsvp === 'yes' ? `Ирэхээ мэдэгдсэн${rCount > 1 ? ` · ${rCount} хүн` : ''}` : rsvp === 'no' ? 'Хариу: ирэхгүй' : rsvp === 'maybe' ? 'Хариу: магадгүй' : 'Ирэхээ мэдэгдэх'}
                primary={!rsvp} success={rsvp === 'yes'}
                onClick={() => setRsvpOpen(true)}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <GA icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14.5s5-4.2 5-7.8A5 5 0 003 6.7c0 3.6 5 7.8 5 7.8z"/><circle cx="8" cy="6.8" r="1.8"/></svg>} label="Газрын зураг" onClick={() => toast('Google Maps нээгдэж байна...', 'info')} />
                <GA icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="6.5" x2="14" y2="6.5"/><line x1="5.5" y1="1.5" x2="5.5" y2="4.5"/><line x1="10.5" y1="1.5" x2="10.5" y2="4.5"/></svg>} label="Календарт нэмэх" onClick={() => toast('Календарт нэмэгдлээ (.ics)', 'success')} />
              </div>
              <GA icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="3.5" r="1.8"/><circle cx="4" cy="8" r="1.8"/><circle cx="12" cy="12.5" r="1.8"/><line x1="5.6" y1="7.1" x2="10.4" y2="4.4"/><line x1="5.6" y1="8.9" x2="10.4" y2="11.6"/></svg>} label="Хуваалцах" onClick={() => setShareOpen(true)} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>Асуух зүйл байвал: {invite.phone}</div>
            <div onClick={() => nav('landing')} style={{ fontSize: 10, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, paddingTop: 6, cursor: 'pointer' }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 7, fontWeight: 700 }}>i</span>
              </div>
              invites.mn дээр үүсгэв
            </div>
          </div>
        </div>

        {/* RSVP bottom sheet — форм */}
        {rsvpOpen && (
          <div onClick={closeRsvp} style={{ position: 'fixed', inset: 0, zIndex: 300, backgroundColor: 'rgba(31,29,26,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'protoFadeIn 180ms ease-out' }}>
            <div onClick={e => e.stopPropagation()} style={{
              width: 400, maxHeight: '88vh', overflowY: 'auto', boxSizing: 'border-box',
              backgroundColor: 'var(--color-surface)', borderRadius: '20px 20px 0 0',
              padding: '12px 24px 28px', animation: 'protoSheetUp 240ms ease-out',
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--color-border)', margin: '0 auto 18px' }}></div>
              {rDone ? (
                <div style={{ textAlign: 'center', padding: '8px 0 4px', animation: 'protoFadeIn 200ms ease-out' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,12.5 10,17.5 19,7"/></svg>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Хариу илгээгдлээ</div>
                  <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 18 }}>
                    Баярлалаа, {rName.trim()}!{rChoice === 'yes' ? ` Таныг ${rCount} хүнтэй ирнэ гэж бүртгэлээ.` : rChoice === 'maybe' ? ' Тодорхой болохоороо хариугаа шинэчлээрэй.' : ' Харамсалтай ч ойлголоо.'}
                  </div>
                  <span onClick={closeRsvp}><DSButton variant="secondary" style={{ width: '100%' }}>Хаах</DSButton></span>
                </div>
              ) : (
                <React.Fragment>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>Ирэхээ мэдэгдэх</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18, textAlign: 'center' }}>{invite.host}-д хариу илгээнэ</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Таны нэр *</div>
                  <input value={rName} onChange={e => { setRName(e.target.value); setRErr(p => ({ ...p, name: null })); }} placeholder="Нэрээ оруулна уу" style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-family)',
                    border: `1px solid ${rErr.name ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    boxShadow: rErr.name ? '0 0 0 3px var(--color-danger-bg)' : 'none',
                    borderRadius: 'var(--radius-sm)', outline: 'none', marginBottom: rErr.name ? 4 : 14,
                  }} />
                  {rErr.name && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginBottom: 12 }}>{rErr.name}</div>}
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Ирэх эсэх *</div>
                  <div style={{ display: 'flex', borderRadius: 'var(--radius-sm)', border: `1px solid ${rErr.choice ? 'var(--color-danger)' : 'var(--color-border)'}`, overflow: 'hidden', marginBottom: rErr.choice ? 4 : 14 }}>
                    {[['yes','Ирнэ'],['no','Ирэхгүй'],['maybe','Магадгүй']].map(([k, l], i) => (
                      <div key={k} onClick={() => { setRChoice(k); setRErr(p => ({ ...p, choice: null })); }} style={{
                        flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 13, fontWeight: rChoice === k ? 600 : 400, cursor: 'pointer',
                        backgroundColor: rChoice === k ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: rChoice === k ? '#fff' : 'var(--color-text-secondary)',
                        borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
                        transition: 'background-color 180ms ease-out',
                      }}>{l}</div>
                    ))}
                  </div>
                  {rErr.choice && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginBottom: 12 }}>{rErr.choice}</div>}
                  {rChoice === 'yes' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, animation: 'protoFadeIn 180ms ease-out' }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>Хэдэн хүн ирэх вэ?</span>
                      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                        <div onClick={() => setRCount(c => Math.max(1, c - 1))} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--color-text-secondary)', cursor: 'pointer', userSelect: 'none' }}>−</div>
                        <div style={{ width: 36, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>{rCount}</div>
                        <div onClick={() => setRCount(c => Math.min(10, c + 1))} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--color-text-secondary)', cursor: 'pointer', userSelect: 'none' }}>+</div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Тайлбар <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(заавал биш)</span></div>
                  <textarea value={rNote} onChange={e => setRNote(e.target.value)} placeholder="Жнь: бага зэрэг оройтож очно" style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--font-family)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none',
                    minHeight: 52, resize: 'none', marginBottom: 16,
                  }}></textarea>
                  <span onClick={submitRsvp}><DSButton variant="primary" size="lg" style={{ width: '100%' }}>Хариу илгээх</DSButton></span>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 12 }}>эсвэл утсаар: {invite.phone}</div>
                </React.Fragment>
              )}
            </div>
          </div>
        )}

        {/* Share sheet */}
        {shareOpen && (
          <div onClick={() => setShareOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, backgroundColor: 'rgba(31,29,26,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'protoFadeIn 180ms ease-out' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: 400, backgroundColor: 'var(--color-surface)', borderRadius: '20px 20px 0 0', padding: '12px 24px 28px', animation: 'protoSheetUp 240ms ease-out' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--color-border)', margin: '0 auto 18px' }}></div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>Урилга хуваалцах</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 12px',
                borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', marginBottom: 12,
              }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1 }}>invites.mn/i/{invite.slug}</span>
                <span onClick={() => { setShareOpen(false); toast('Линк хуулагдлаа', 'success'); }}><DSButton variant="primary" size="sm">Хуулах</DSButton></span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {['Messenger', 'SMS', 'И-мэйл'].map(ch => (
                  <div key={ch} onClick={() => { setShareOpen(false); toast(`${ch}-ээр илгээгдэж байна...`, 'info'); }} style={{
                    padding: '12px 0', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer',
                    border: '1px solid var(--color-border)', fontSize: 12, fontWeight: 500,
                  }}>{ch}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ProtoDashboard, ProtoGuest });
