/* invites — Prototype: public flow (landing → templates → detail) */

/* Clickable header */
function ProtoHeader({ active }) {
  const { nav } = useProto();
  const navItems = [['Загварууд', 'templates'], ['Хэрхэн ажилладаг', 'landing'], ['Үнэ', 'landing']];
  return (
    <div style={{
      height: 64, padding: '0 48px', position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <div onClick={() => nav('landing')} style={{ cursor: 'pointer' }}><PLogo /></div>
        <nav style={{ display: 'flex', gap: 28 }}>
          {navItems.map(([n, to]) => (
            <span key={n} onClick={() => nav(to)} style={{
              fontSize: 12, fontWeight: n === active ? 500 : 400, cursor: 'pointer',
              color: n === active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}>{n}</span>
          ))}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span onClick={() => nav('dashboard')} style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Нэвтрэх</span>
        <span onClick={() => nav('templates')}><DSButton variant="primary">Урилга үүсгэх</DSButton></span>
      </div>
    </div>
  );
}

/* Clickable template card */
function ProtoTplCard({ tpl, w = 'auto', thumbH = 230 }) {
  const { nav } = useProto();
  return (
    <div className="proto-card" onClick={() => nav('detail', { tpl: tpl.id })} style={{
      width: w, borderRadius: 'var(--radius-md)', overflow: 'hidden',
      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
      boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
    }}>
      <div style={{ height: thumbH, position: 'relative' }}>
        <TplArt kind={tpl.art} scale={thumbH / 230} />
        <div style={{ position: 'absolute', top: 8, left: 8 }}><TypeBadge type={tpl.type} /></div>
        {tpl.premium && <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}>PRO</span>}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{tpl.name}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{tpl.cat}</div>
      </div>
    </div>
  );
}

/* ——— Landing ——— */
function ProtoLanding() {
  const { nav } = useProto();
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh' }}>
      <ProtoHeader />
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, padding: '64px 48px 72px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', fontSize: 11, fontWeight: 500, marginBottom: 20 }}>
            Монголын дижитал урилгын платформ
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 16px' }}>
            Баярын урилгаа<br/>минутын дотор
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 28px', maxWidth: 400 }}>
            Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай. Дизайнер шаардлагагүй — ердөө гурван алхам.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <span onClick={() => nav('templates')}><DSButton variant="accent" size="lg">Урилга үүсгэх</DSButton></span>
            <span onClick={() => nav('templates')}><DSButton variant="secondary" size="lg" style={{ whiteSpace: 'nowrap' }}>Загварууд үзэх</DSButton></span>
          </div>
        </div>
        <div style={{ width: 290, flexShrink: 0 }}>
          <DSPhonePreviewFrame>
            <div style={{ height: '100%', overflow: 'hidden', backgroundColor: '#FDFCFA' }}>
              <LiveInviteCard d={defaultInvite} scale={0.94} />
            </div>
          </DSPhonePreviewFrame>
        </div>
      </div>
      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', borderBottom: '1px solid var(--color-border-muted)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 48px' }}>
          <HowItWorks />
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 48px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Онцлох загварууд</div>
          <span onClick={() => nav('templates')}><DSButton variant="ghost">Бүгдийг үзэх<ChevronIcon/></DSButton></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {protoTemplates.map(t => <ProtoTplCard key={t.id} tpl={t} thumbH={185} />)}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

/* ——— Templates listing ——— */
function ProtoTemplates() {
  const { nav } = useProto();
  const [cat, setCat] = React.useState('Бүгд');
  const [q, setQ] = React.useState('');
  const cats = ['Бүгд', 'Төрсөн өдөр', 'Хурим', 'Корпоратив', 'Төгсөлт', 'Хүүхэд угтах', 'Нээлт'];
  const filtered = protoTemplates.filter(t =>
    (cat === 'Бүгд' || t.cat === cat) &&
    (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.cat.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh' }}>
      <ProtoHeader active="Загварууд" />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 48px 80px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Загварууд</h1>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{filtered.length} загвараас баярт тань тохирохыг олоорой</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <span key={c} onClick={() => setCat(c)}><DSCategoryChip label={c} active={c === cat} /></span>
            ))}
          </div>
          <div style={{ position: 'relative', width: 220 }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}><SearchIcon/></div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Загвар хайх..." style={{
              width: '100%', padding: '8px 12px 8px 32px', fontSize: 12, fontFamily: 'var(--font-family)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none',
              backgroundColor: 'var(--color-surface)', boxSizing: 'border-box',
            }} />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            <DSEmptyState title="Загвар олдсонгүй" description={`«${q}» хайлтад тохирох загвар алга. Өөр түлхүүр үг туршаад үзээрэй.`} />
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 32, marginTop: -8 }}>
              <span onClick={() => { setQ(''); setCat('Бүгд'); }}><DSButton variant="secondary">Шүүлт арилгах</DSButton></span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {filtered.map(t => <ProtoTplCard key={t.id} tpl={t} thumbH={240} />)}
          </div>
        )}
      </div>
      <PublicFooter compact />
    </div>
  );
}

/* ——— Template detail ——— */
function ProtoDetail() {
  const { nav, params } = useProto();
  const tpl = protoTemplates.find(t => t.id === params.tpl) || protoTemplates[0];
  const similar = protoTemplates.filter(t => t.id !== tpl.id).slice(0, 4);
  const fields = ['Арга хэмжээний нэр', 'Зохион байгуулагч', 'Огноо ба цаг', 'Байршил', 'Үндсэн зураг', 'Тэмдэглэл', 'QR код'];
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh' }}>
      <ProtoHeader active="Загварууд" />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 48px 64px' }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          <span onClick={() => nav('templates')} style={{ cursor: 'pointer', color: 'var(--color-accent)' }}>Загварууд</span>
          <span style={{ margin: '0 6px' }}>/</span>{tpl.cat}
          <span style={{ margin: '0 6px' }}>/</span><span style={{ color: 'var(--color-text-secondary)' }}>{tpl.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 48 }}>
          <div style={{ width: 360, flexShrink: 0 }}>
            <div style={{
              position: 'relative', height: 540, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-md)',
            }}>
              <TplArt kind={tpl.art} scale={2.2} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}><TypeBadge type={tpl.type} /></div>
              {tpl.premium && <span style={{ position: 'absolute', top: 12, right: 12, padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}>PRO</span>}
            </div>
          </div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <DSBadge variant="primary">{tpl.cat}</DSBadge>
              <DSBadge>{tpl.type === 'video' ? 'Видео урилга' : 'Зургийн урилга'}</DSBadge>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>{tpl.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 420 }}>
              {tpl.cat} арга хэмжээнд зориулсан загвар. Нэр, огноо, байршил, зургаа оруулахад урилга тань бэлэн болно.
            </p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>Орлуулах боломжтой талбарууд</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 460 }}>
                {fields.map(f => (
                  <span key={f} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                    borderRadius: 99, fontSize: 11, backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--color-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4.5,7.5 8,3"/></svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <span onClick={() => nav('create', { tpl: tpl.id })}><DSButton variant="accent" size="lg">Энэ загвараар урилга үүсгэх</DSButton></span>
              <span onClick={() => nav('guest')}><DSButton variant="secondary" size="lg">Урьдчилан үзэх</DSButton></span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{tpl.premium ? 'PRO загвар — Стандарт багцад багтсан · ' : 'Үнэгүй загвар · '}1,240 удаа ашиглагдсан</div>
          </div>
        </div>
        <div style={{ marginTop: 56 }}>
          <DSSectionHeader title="Төстэй загварууд" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 12 }}>
            {similar.map(t => <ProtoTplCard key={t.id} tpl={t} thumbH={200} />)}
          </div>
        </div>
      </div>
      <PublicFooter compact />
    </div>
  );
}

Object.assign(window, { ProtoHeader, ProtoTplCard, ProtoLanding, ProtoTemplates, ProtoDetail });
