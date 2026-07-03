/* invites — Prototype: shared layer (context, toasts, modal, realistic template art, live invite card) */

const ProtoCtx = React.createContext(null);
function useProto() { return React.useContext(ProtoCtx); }

/* ——— Realistic invitation-like template art (original, typographic) ——— */
function TplArt({ kind, scale = 1 }) {
  const base = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' };
  const f = (n) => Math.round(n * scale);
  if (kind === 'birthday') return (
    <div style={{ ...base, backgroundColor: '#FBF5EB' }}>
      <div style={{ position: 'absolute', inset: f(8), border: '1px solid #E2CFA8', borderRadius: 4 }}></div>
      {[['12%','18%','#C9A86A'],['80%','14%','#8B5CF6'],['18%','78%','#D9B8F5'],['85%','72%','#E2CFA8'],['8%','52%','#8B5CF6']].map((d,i)=>(
        <div key={i} style={{ position: 'absolute', left: d[0], top: d[1], width: f(5), height: f(5), borderRadius: '50%', backgroundColor: d[2], opacity: 0.7 }}></div>
      ))}
      <div style={{ fontSize: f(9), letterSpacing: '0.3em', color: '#A8895C', marginBottom: f(6) }}>ТӨРСӨН ӨДӨР</div>
      <div style={{ position: 'relative', marginBottom: f(6) }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: f(52), height: f(52), borderRadius: '50%', backgroundColor: '#F3EEFE' }}></div>
        <span style={{ position: 'relative', fontSize: f(44), fontWeight: 700, color: '#8B5CF6', lineHeight: 1 }}>6</span>
      </div>
      <div style={{ fontSize: f(15), fontWeight: 700, color: '#3D3528', letterSpacing: '0.06em' }}>АНУЖИН</div>
      <div style={{ fontSize: f(8), color: '#A8895C', marginTop: f(4) }}>2026.06.21 · 18:00</div>
    </div>
  );
  if (kind === 'wedding') return (
    <div style={{ ...base, backgroundColor: '#2E3829' }}>
      <div style={{ position: 'absolute', inset: f(10), border: '1px solid rgba(201,168,106,0.5)' }}></div>
      <div style={{ width: f(30), height: 1, backgroundColor: '#C9A86A', marginBottom: f(10) }}></div>
      <div style={{ fontSize: f(8), letterSpacing: '0.34em', color: '#C9A86A', marginBottom: f(8) }}>ХУРИМЫН ЁСЛОЛ</div>
      <div style={{ fontSize: f(17), fontWeight: 500, color: '#F3EDDF', lineHeight: 1.4 }}>Болд<span style={{ color: '#C9A86A', padding: `0 ${f(6)}px`, fontWeight: 400 }}>&</span>Сараа</div>
      <div style={{ fontSize: f(8), color: 'rgba(243,237,223,0.65)', marginTop: f(8) }}>2026.09.14 · Туушин</div>
      <div style={{ width: f(30), height: 1, backgroundColor: '#C9A86A', marginTop: f(10) }}></div>
    </div>
  );
  if (kind === 'corporate') return (
    <div style={{ ...base, backgroundColor: '#1C1F2B', alignItems: 'flex-start', textAlign: 'left', padding: `0 ${f(16)}px` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: f(5), backgroundColor: '#8B5CF6' }}></div>
      <div style={{ fontSize: f(8), letterSpacing: '0.26em', color: '#9D8FE8', marginBottom: f(8) }}>УРИЛГА · 2026</div>
      <div style={{ fontSize: f(14), fontWeight: 700, color: '#F2F1F7', lineHeight: 1.3 }}>Жилийн нэгдсэн<br/>хурал</div>
      <div style={{ width: f(24), height: 2, backgroundColor: '#8B5CF6', margin: `${f(8)}px 0` }}></div>
      <div style={{ fontSize: f(8), color: 'rgba(242,241,247,0.6)', lineHeight: 1.6 }}>10 сарын 2 · 09:00<br/>Корпорейт конвешн төв</div>
    </div>
  );
  if (kind === 'graduation') return (
    <div style={{ ...base, backgroundColor: '#F5F2EA' }}>
      <div style={{ width: f(26), height: f(26), backgroundColor: '#1F2A44', transform: 'rotate(45deg)', marginBottom: f(2) }}></div>
      <div style={{ width: 1.5, height: f(14), backgroundColor: '#C9A86A', marginBottom: f(10) }}></div>
      <div style={{ fontSize: f(9), letterSpacing: '0.3em', color: '#1F2A44', marginBottom: f(5) }}>ТӨГСӨЛТИЙН БАЯР</div>
      <div style={{ fontSize: f(22), fontWeight: 700, color: '#1F2A44' }}>2026</div>
      <div style={{ fontSize: f(8), color: '#8A7E5C', marginTop: f(5) }}>МУИС · 6 сарын 26</div>
    </div>
  );
  if (kind === 'baby') return (
    <div style={{ ...base, backgroundColor: '#F6F1FB' }}>
      {[['16%','20%',f(10)],['78%','16%',f(7)],['22%','76%',f(7)],['82%','70%',f(11)]].map((c,i)=>(
        <div key={i} style={{ position: 'absolute', left: c[0], top: c[1], width: c[2], height: c[2], borderRadius: '50%', border: '1.5px solid #D9C5F2', opacity: 0.8 }}></div>
      ))}
      <div style={{ width: f(40), height: f(40), borderRadius: '50%', backgroundColor: '#E9DDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: f(10) }}>
        <div style={{ width: f(16), height: f(16), borderRadius: '50%', backgroundColor: '#8B5CF6', opacity: 0.55 }}></div>
      </div>
      <div style={{ fontSize: f(13), fontWeight: 700, color: '#4A3D63' }}>Бяцхан гүнж</div>
      <div style={{ fontSize: f(9), color: '#9B8BB5', marginTop: f(3) }}>угтах ёслол · 7 сарын 5</div>
    </div>
  );
  /* opening */
  return (
    <div style={{ ...base, backgroundColor: '#A8432C' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: f(3), backgroundColor: 'rgba(255,255,255,0.25)', transform: 'translateX(-50%)' }}></div>
      <div style={{ position: 'relative', backgroundColor: '#A8432C', padding: `${f(8)}px 0` }}>
        <div style={{ fontSize: f(8), letterSpacing: '0.3em', color: '#F2C9A8', marginBottom: f(6) }}>ТАВТАЙ МОРИЛ</div>
        <div style={{ fontSize: f(20), fontWeight: 700, color: '#FFF6EC', letterSpacing: '0.04em' }}>ИХ НЭЭЛТ</div>
        <div style={{ fontSize: f(8), color: 'rgba(255,246,236,0.75)', marginTop: f(6) }}>Гранд Плаза · 8 сарын 1 · 11:00</div>
      </div>
    </div>
  );
}

/* ——— Prototype template catalogue with realistic Mongolian data ——— */
const protoTemplates = [
  { id: 'tsetsegs', art: 'birthday', name: 'Цэцэгс', cat: 'Төрсөн өдөр', type: 'image' },
  { id: 'altan-namar', art: 'wedding', name: 'Алтан намар', cat: 'Хурим', type: 'image', premium: true },
  { id: 'gerelt-udesh', art: 'corporate', name: 'Гэрэлт үдэш', cat: 'Корпоратив', type: 'video' },
  { id: 'tugsult', art: 'graduation', name: 'Мөнгөн шугам', cat: 'Төгсөлт', type: 'image' },
  { id: 'bagachuud', art: 'baby', name: 'Багачууд', cat: 'Хүүхэд угтах', type: 'image' },
  { id: 'shine-garaa', art: 'opening', name: 'Шинэ гараа', cat: 'Нээлт', type: 'video', premium: true },
];

const defaultInvite = {
  title: 'Анужингийн төрсөн өдөр',
  host: 'Бат-Эрдэнэ, Солонго нар',
  type: 'Төрсөн өдөр',
  date: '2026.06.21',
  time: '18:00',
  venue: 'Shangri-La Ulaanbaatar',
  address: 'Олимпийн гудамж 19А, 3 давхар, Хан танхим',
  maps: '',
  note: 'Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирэхийг хүсье.',
  phone: '9911-2233',
  photo: false,
  photoZoom: 40,
  slug: 'anujin-6nas',
  isPublic: true,
};

/* ——— Live invite card (data-driven) ——— */
function LiveInviteCard({ d, scale = 1, artKind = 'birthday' }) {
  const Row = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</div>
      </div>
    </div>
  );
  return (
    <div style={{ backgroundColor: '#FDFCFA', transform: scale !== 1 ? `scale(${scale})` : 'none', transformOrigin: 'top center', width: scale !== 1 ? `${100/scale}%` : '100%' }}>
      <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
        <TplArt kind={artKind} scale={0.7} />
      </div>
      <div style={{ padding: '20px 22px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          width: 78, height: 78, borderRadius: '50%', margin: '-56px auto 12px', position: 'relative',
          border: '3px solid #FDFCFA', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
          backgroundColor: 'var(--color-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {d.photo ? (
            <div style={{
              position: 'absolute', inset: 0, transform: `scale(${1 + d.photoZoom / 100})`,
              background: 'radial-gradient(circle at 38% 32%, #E9DDF8 0%, #C9A86A 55%, #8B6F44 100%)',
              transition: 'transform 180ms ease-out',
            }}></div>
          ) : (
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace', position: 'relative' }}>зураг</span>
          )}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 4, minHeight: 24 }}>
          {d.title || <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 13 }}>Арга хэмжээний нэр...</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 14 }}>{d.host ? `${d.host} урьж байна` : ' '}</div>
        <div style={{ width: 34, height: 1.5, backgroundColor: 'var(--color-accent)', margin: '0 auto 14px', borderRadius: 1 }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          <Row icon={<CalendarIcon/>} label="Огноо" value={`${d.date}${d.time ? ', ' + d.time : ''}`} />
          <Row icon={<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13s4.5-3.8 4.5-7A4.5 4.5 0 002.5 6c0 3.2 4.5 7 4.5 7z"/><circle cx="7" cy="6" r="1.5"/></svg>} label="Байршил" value={d.venue || '—'} />
        </div>
        {d.note && <div style={{ fontSize: 10.5, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{d.note}</div>}
        <div style={{
          width: '100%', padding: '9px 0', borderRadius: 10,
          backgroundColor: 'var(--color-primary)', color: '#fff',
          fontSize: 11.5, fontWeight: 500, textAlign: 'center',
        }}>Ирэхээ мэдэгдэх</div>
      </div>
    </div>
  );
}

/* ——— Toast host ——— */
function ToastHost({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ animation: 'protoToastIn 200ms ease-out' }}>
          <DSToast variant={t.variant} message={t.msg} />
        </div>
      ))}
    </div>
  );
}

/* ——— Confirm modal ——— */
function ProtoModal({ open, title, desc, confirmLabel = 'Тийм', danger, accent, onConfirm, onCancel, children }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 300, backgroundColor: 'rgba(31,29,26,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'protoFadeIn 180ms ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 360, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)',
        animation: 'protoPopIn 180ms ease-out', fontFamily: 'var(--font-family)',
      }}>
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</div>
          {desc && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{desc}</div>}
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 24px', borderTop: '1px solid var(--color-border-muted)', marginTop: 16 }}>
          <span onClick={onCancel}><DSButton variant="ghost">Болих</DSButton></span>
          <span onClick={onConfirm}><DSButton variant={danger ? 'danger' : accent ? 'accent' : 'primary'}>{confirmLabel}</DSButton></span>
        </div>
      </div>
    </div>
  );
}

/* ——— Prototype flow switcher (chrome, not product UI) ——— */
function FlowSwitcher({ screen }) {
  const { nav } = useProto();
  const flows = [
    ['landing', 'Нүүр'], ['templates', 'Загварууд'], ['create', 'Үүсгэх'],
    ['dashboard', 'Dashboard'], ['guest', 'Зочин'], ['editor', 'Admin editor'], ['assets', 'Файлын сан'],
  ];
  return (
    <div data-omelette-chrome="" style={{
      position: 'fixed', bottom: 16, left: 16, zIndex: 350,
      display: 'flex', gap: 2, padding: 4, borderRadius: 99,
      backgroundColor: 'rgba(31,29,26,0.88)', backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-family)',
    }}>
      {flows.map(([k, l]) => (
        <div key={k} onClick={() => nav(k)} style={{
          padding: '5px 11px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
          backgroundColor: screen === k ? 'var(--color-accent)' : 'transparent',
          color: screen === k ? '#fff' : 'rgba(255,255,255,0.6)',
          transition: 'all 200ms ease-out', whiteSpace: 'nowrap',
        }}>{l}</div>
      ))}
    </div>
  );
}

Object.assign(window, { ProtoCtx, useProto, TplArt, protoTemplates, defaultInvite, LiveInviteCard, ToastHost, ProtoModal, FlowSwitcher });
