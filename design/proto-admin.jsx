/* invites — Prototype: admin template editor (fully interactive) */

const SAMPLE = {
  event_title: 'Болд & Сараа', host_name: 'Хоёр гэр бүлээс урьж байна',
  event_date: '2026.09.14', event_time: '17:00', location: 'Туушин зочид буудал, Их танхим',
  rsvp: 'RSVP: 9911-2233', custom_text: 'Хайр бүхнийг ялна',
};
const FIELD_TYPES = [
  { type: 'text', label: 'Text талбар', icon: 'text', key: 'custom_text' },
  { type: 'date', label: 'Date талбар', icon: 'date', key: 'event_date' },
  { type: 'time', label: 'Time талбар', icon: 'clock', key: 'event_time' },
  { type: 'location', label: 'Location талбар', icon: 'pin', key: 'location' },
  { type: 'image', label: 'Зураг талбар', icon: 'photo', key: 'photo' },
  { type: 'qr', label: 'QR код', icon: 'qr', key: 'qr_code' },
  { type: 'rsvp', label: 'RSVP / холбоо', icon: 'rsvp', key: 'rsvp' },
];

const initialFields = [
  { id: 1, key: 'main_photo', type: 'image', icon: 'photo', x: 380, y: 220, w: 320, h: 320, round: true, visible: true, locked: false, label: 'Үндсэн зураг', placeholder: 'Зураг', required: true, fontSize: 0, weight: '400', align: 'C' },
  { id: 2, key: 'event_title', type: 'text', icon: 'text', x: 90, y: 640, w: 900, h: 130, visible: true, locked: false, label: 'Арга хэмжээний нэр', placeholder: 'Жнь: Болд & Сараа', required: true, fontSize: 64, weight: '700', align: 'C' },
  { id: 3, key: 'host_name', type: 'text', icon: 'text', x: 190, y: 790, w: 700, h: 70, visible: true, locked: false, label: 'Урьж буй хүн', placeholder: 'Нэр', required: false, fontSize: 30, weight: '400', align: 'C' },
  { id: 4, key: 'location', type: 'location', icon: 'pin', x: 140, y: 1100, w: 800, h: 80, visible: true, locked: true, label: 'Байршил', placeholder: 'Газрын нэр', required: true, fontSize: 30, weight: '400', align: 'C' },
  { id: 5, key: 'qr_code', type: 'qr', icon: 'qr', x: 440, y: 1550, w: 200, h: 200, visible: false, locked: false, label: 'QR код', placeholder: 'QR', required: false, fontSize: 0, weight: '400', align: 'C' },
];

function ProtoEditor() {
  const { nav, toast } = useProto();
  const [fields, setFields] = React.useState(initialFields);
  const [selId, setSelId] = React.useState(2);
  const [zoom, setZoom] = React.useState(0.9);
  const [safeArea, setSafeArea] = React.useState(true);
  const [sampleData, setSampleData] = React.useState(true);
  const [mobilePrev, setMobilePrev] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [confirmDel, setConfirmDel] = React.useState(null);
  const [pubModal, setPubModal] = React.useState(null); // 'invalid' | 'confirm'
  const [status, setStatus] = React.useState('draft');
  const [thumb, setThumb] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [leaveModal, setLeaveModal] = React.useState(false);
  const nextId = React.useRef(10);

  const CW = 1080, CH = 1920;
  const dispW = 300 * (zoom / 0.9);
  const s = dispW / CW;
  const sel = fields.find(f => f.id === selId);
  const touch = (fn) => { setDirty(true); fn(); };
  const updSel = (patch) => touch(() => setFields(fs => fs.map(f => f.id === selId ? { ...f, ...patch } : f)));
  const updField = (id, patch) => touch(() => setFields(fs => fs.map(f => f.id === id ? { ...f, ...patch } : f)));

  const missing = [];
  if (!fields.some(f => f.type === 'date')) missing.push('event_date талбар нэмэгдээгүй');
  if (!thumb) missing.push('Thumbnail оруулаагүй');

  const addField = (ft) => {
    const id = nextId.current++;
    const isImg = ft.type === 'image' || ft.type === 'qr';
    const f = {
      id, key: `${ft.key}_${id}`.replace(/_10$/, ''), type: ft.type, icon: ft.icon,
      x: 240, y: 880, w: isImg ? 240 : 600, h: isImg ? 240 : 80,
      round: ft.type === 'image', visible: true, locked: false,
      label: ft.label.replace(' талбар', ''), placeholder: SAMPLE[ft.key] || ft.label,
      required: false, fontSize: isImg ? 0 : 30, weight: '400', align: 'C',
    };
    touch(() => setFields(fs => [...fs, f]));
    setSelId(id); setAddOpen(false);
    toast(`«${f.key}» талбар нэмэгдлээ`, 'success');
  };

  const duplicate = (f) => {
    const id = nextId.current++;
    touch(() => setFields(fs => [...fs, { ...f, id, key: f.key + '_copy', x: f.x + 40, y: f.y + 40, locked: false }]));
    setSelId(id);
    toast('Талбар хувилагдлаа', 'success');
  };

  const del = () => {
    touch(() => setFields(fs => fs.filter(f => f.id !== confirmDel.id)));
    if (selId === confirmDel.id) setSelId(null);
    setConfirmDel(null);
    toast('Талбар устгагдлаа', 'success');
  };

  const startDrag = (e, f) => {
    if (f.locked) { toast('Байрлал түгжээтэй — тохиргоог баруун самбараас засах боломжтой', 'warning'); return; }
    e.preventDefault();
    setSelId(f.id);
    const sx = e.clientX, sy = e.clientY, ox = f.x, oy = f.y;
    const move = (ev) => updField(f.id, {
      x: Math.round(Math.max(0, Math.min(CW - f.w, ox + (ev.clientX - sx) / s))),
      y: Math.round(Math.max(0, Math.min(CH - f.h, oy + (ev.clientY - sy) / s))),
    });
    const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  const fieldText = (f) => sampleData ? (SAMPLE[f.key] || SAMPLE[f.key.replace(/_\d+$/, '')] || f.placeholder) : null;

  const NumIn = ({ label, value, onChange, w = '25%' }) => (
    <div style={{ width: w }}>
      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value) || 0)} style={{
        width: '100%', boxSizing: 'border-box', padding: '5px 6px', fontSize: 11, fontFamily: 'var(--font-family)',
        border: '1px solid var(--color-border)', borderRadius: 6, outline: 'none',
      }} />
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      {/* Topbar */}
      <div style={{ height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)', flexShrink: 0 }}>
        <span onClick={() => dirty ? setLeaveModal(true) : nav('assets')}><DSButton variant="ghost" size="sm">← Загварууд</DSButton></span>
        <div style={{ width: 1, height: 18, backgroundColor: 'var(--color-border-muted)' }}></div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Алтан намар</span>
        <DSStatusBadge status={status} />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: dirty ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>{dirty ? 'Хадгалаагүй өөрчлөлт' : 'Хадгалагдсан'}</span>
          <span onClick={() => { setDirty(false); toast('Загвар хадгалагдлаа', 'success'); }}><DSButton variant="secondary" size="sm">Хадгалах</DSButton></span>
          <span onClick={() => setPubModal(missing.length ? 'invalid' : 'confirm')}>
            <DSButton variant="accent" size="sm" disabled={status === 'published'}>{status === 'published' ? 'Нийтлэгдсэн' : 'Нийтлэх'}</DSButton>
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left: settings */}
        <div style={{ width: 230, flexShrink: 0, backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border-muted)', padding: 16, overflowY: 'auto' }}>
          <EPanelTitle>Загварын тохиргоо</EPanelTitle>
          <PInput label="Нэр" value="Алтан намар" onChange={() => setDirty(true)} />
          <PInput label="Slug" value="altan-namar" onChange={() => setDirty(true)} />
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Төрөл</div>
          <ESegment options={['Зураг', 'Видео']} active="Зураг" />
          <div style={{ height: 14 }}></div>
          <EPanelTitle>Фон файл</EPanelTitle>
          <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', padding: 10, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <div style={{ position: 'relative', width: 34, height: 46, borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}><TplArt kind="wedding" scale={0.25} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>altan-namar.png</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>2.4 MB · 1080×1920</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Thumbnail {thumb ? '' : <span style={{ color: 'var(--color-warning)' }}>*</span>}</div>
          {thumb ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: 11 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--color-success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,8.5 6.5,12 13,4.5"/></svg>
              thumb-altan.png
            </div>
          ) : (
            <div onClick={() => { setThumb(true); setDirty(true); toast('Thumbnail орлоо', 'success'); }} style={{
              borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--color-border)', padding: '12px 10px',
              textAlign: 'center', cursor: 'pointer', fontSize: 11, color: 'var(--color-text-secondary)',
            }}>Зураг оруулах</div>
          )}
        </div>

        {/* Center: canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#211F1C' }}>
          <div style={{ height: 40, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))} style={ztBtn}>−</div>
              <div style={{ ...ztBtn, minWidth: 38 }}>{Math.round(zoom / 0.9 * 100)}%</div>
              <div onClick={() => setZoom(z => Math.min(1.5, +(z + 0.15).toFixed(2)))} style={ztBtn}>+</div>
              <span onClick={() => setZoom(0.9)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 4, cursor: 'pointer' }}>Багтаах</span>
            </div>
            <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.12)' }}></div>
            {[
              { l: 'Safe area', v: safeArea, set: setSafeArea },
              { l: 'Жишээ дата', v: sampleData, set: setSampleData },
              { l: 'Mobile preview', v: mobilePrev, set: setMobilePrev },
            ].map((t, i) => (
              <div key={i} onClick={() => t.set(!t.v)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <div style={{ width: 24, height: 14, borderRadius: 7, padding: 2, boxSizing: 'border-box', backgroundColor: t.v ? 'var(--color-accent)' : 'rgba(255,255,255,0.18)', display: 'flex', justifyContent: t.v ? 'flex-end' : 'flex-start', transition: 'background-color 180ms ease-out' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fff' }}></div>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{t.l}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>1080×1920 · story</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'safe center', justifyContent: 'center', padding: 24 }}>
            <div style={{
              position: 'relative', width: dispW, height: dispW * CH / CW, flexShrink: 0,
              borderRadius: mobilePrev ? 28 : 6,
              border: mobilePrev ? '8px solid #0E0D0B' : 'none',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45)', boxSizing: 'content-box',
              transition: 'width 180ms ease-out, border-radius 180ms ease-out',
            }}>
              <div onClick={() => setSelId(null)} style={{ position: 'absolute', inset: 0, borderRadius: mobilePrev ? 20 : 6, overflow: 'hidden' }}>
                <TplArt kind="wedding" scale={dispW / 130} />
              </div>
              {safeArea && <div style={{ position: 'absolute', inset: dispW * 0.07, border: '1px dashed rgba(139,92,246,0.5)', borderRadius: 4, pointerEvents: 'none' }}></div>}
              {fields.filter(f => f.visible).map(f => {
                const isSel = f.id === selId;
                const txt = fieldText(f);
                return (
                  <div key={f.id} onPointerDown={(e) => startDrag(e, f)}
                    style={{
                      position: 'absolute', left: f.x * s, top: f.y * s, width: f.w * s, height: f.h * s,
                      border: isSel ? '1.5px solid var(--color-accent)' : '1px dashed rgba(139,92,246,0.55)',
                      borderRadius: f.round ? '50%' : 3,
                      backgroundColor: isSel ? 'rgba(139,92,246,0.07)' : 'transparent',
                      cursor: f.locked ? 'not-allowed' : 'move',
                      display: 'flex', alignItems: 'center',
                      justifyContent: f.align === 'L' ? 'flex-start' : f.align === 'R' ? 'flex-end' : 'center',
                      boxSizing: 'border-box', userSelect: 'none',
                      transition: isSel ? 'none' : 'border-color 180ms ease-out',
                    }}>
                    {isSel && (
                      <React.Fragment>
                        {[['-4px','-4px'],['-4px','calc(100% - 3px)'],['calc(100% - 3px)','-4px'],['calc(100% - 3px)','calc(100% - 3px)']].map((p, i) => (
                          <div key={i} style={{ position: 'absolute', top: p[0], left: p[1], width: 7, height: 7, backgroundColor: '#fff', border: '1.5px solid var(--color-accent)', borderRadius: 1.5, zIndex: 2 }}></div>
                        ))}
                        <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', backgroundColor: 'var(--color-accent)', color: '#fff', fontFamily: 'monospace', zIndex: 2 }}>
                          {f.key} · {f.w}×{f.h} · x{f.x} y{f.y}{f.locked ? ' · 🔒'.replace(' · 🔒', ' · locked') : ''}
                        </div>
                      </React.Fragment>
                    )}
                    {f.type === 'image' || f.type === 'qr' ? (
                      <span style={{ fontSize: Math.max(8, 10 * s * 3), color: '#7A7468', fontFamily: 'monospace' }}>{f.key}</span>
                    ) : txt ? (
                      <span style={{
                        fontSize: Math.max(7, f.fontSize * s), fontWeight: Number(f.weight),
                        color: f.key === 'event_title' || f.key === 'host_name' || f.type === 'location' ? '#F3EDDF' : '#F3EDDF',
                        padding: '0 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>{txt}</span>
                    ) : (
                      <span style={{ fontSize: Math.max(7, 9 * s * 3.6), color: 'rgba(243,237,223,0.5)', fontFamily: 'monospace' }}>{'{' + f.key + '}'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: layers + field settings */}
        <div style={{ width: 256, flexShrink: 0, backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border-muted)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--color-border-muted)', position: 'relative' }}>
            <EPanelTitle right={
              <div onClick={() => setAddOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', cursor: 'pointer' }}>
                <AIc d={adminIcons.plus} size={11} sw={2} /><span style={{ fontSize: 11, fontWeight: 500 }}>Нэмэх</span>
              </div>
            }>Давхарга ({fields.length})</EPanelTitle>
            {addOpen && (
              <div style={{ position: 'absolute', right: 14, top: 36, zIndex: 20, width: 180, padding: '4px 0', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border-muted)', animation: 'protoFadeIn 150ms ease-out' }}>
                {FIELD_TYPES.map(ft => (
                  <div key={ft.type + ft.key} onClick={() => addField(ft)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <span style={{ color: 'var(--color-accent)', display: 'inline-flex' }}><AIc d={adminIcons[ft.icon]} size={13} /></span>
                    {ft.label}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map(f => {
                const isSel = f.id === selId;
                return (
                  <div key={f.id} onClick={() => setSelId(f.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', borderRadius: 7,
                    backgroundColor: isSel ? 'var(--color-accent-subtle)' : 'transparent',
                    border: isSel ? '1px solid #DBC9F9' : '1px solid transparent',
                    cursor: 'pointer', opacity: f.visible ? 1 : 0.45, transition: 'background-color 180ms ease-out',
                  }}>
                    <span style={{ color: isSel ? 'var(--color-accent)' : 'var(--color-text-secondary)', display: 'inline-flex' }}><AIc d={adminIcons[f.icon]} size={13} /></span>
                    <span style={{ flex: 1, fontSize: 11, fontWeight: isSel ? 600 : 400, fontFamily: 'monospace', color: isSel ? 'var(--color-accent)' : 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.key}</span>
                    <span onClick={(e) => { e.stopPropagation(); updField(f.id, { locked: !f.locked }); }} title={f.locked ? 'Байрлалын түгжээ гаргах' : 'Байрлал түгжих — canvas дээр зөөх/хэмжээ өөрчлөхийг хаана. Тохиргоог засах боломжтой хэвээр.'}
                      style={{ color: f.locked ? 'var(--color-warning)' : 'var(--color-text-muted)', display: 'inline-flex', opacity: f.locked ? 1 : 0.45, cursor: 'pointer' }}>
                      <AIc d={f.locked ? adminIcons.lock : adminIcons.unlock} size={11} />
                    </span>
                    <span onClick={(e) => { e.stopPropagation(); updField(f.id, { visible: !f.visible }); }} title={f.visible ? 'Нуух' : 'Харуулах'}
                      style={{ color: 'var(--color-text-muted)', display: 'inline-flex', opacity: f.visible ? 0.45 : 1, cursor: 'pointer' }}>
                      <AIc d={adminIcons.eye} size={12} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {sel ? (
            <div key={sel.id} style={{ padding: 14, animation: 'protoStepIn 180ms ease-out' }}>
              <EPanelTitle right={
                <div style={{ display: 'flex', gap: 5 }}>
                  <span onClick={() => duplicate(sel)}><ARowAction icon={adminIcons.copy} title="Хувилах" /></span>
                  <span onClick={() => setConfirmDel(sel)}><ARowAction icon={adminIcons.trash} danger title="Устгах" /></span>
                </div>
              }>Талбарын тохиргоо</EPanelTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '6px 9px', borderRadius: 7, backgroundColor: 'var(--color-bg)' }}>
                <AIc d={adminIcons[sel.icon]} size={12} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>{sel.key}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{sel.type}</span>
              </div>
              <PInput label="Хэрэглэгчид харагдах нэр" value={sel.label} onChange={v => updSel({ label: v })} />
              <PInput label="Placeholder" value={sel.placeholder} onChange={v => updSel({ placeholder: v })} />
              <div onClick={() => updSel({ required: !sel.required })} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>Заавал бөглөх</span>
                <DSToggle on={sel.required} label="" />
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <NumIn label="X" value={sel.x} onChange={v => updSel({ x: v })} />
                <NumIn label="Y" value={sel.y} onChange={v => updSel({ y: v })} />
                <NumIn label="W" value={sel.w} onChange={v => updSel({ w: v })} />
                <NumIn label="H" value={sel.h} onChange={v => updSel({ h: v })} />
              </div>
              {sel.fontSize > 0 && (
                <React.Fragment>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'flex-end' }}>
                    <NumIn label="Фонт хэмжээ" value={sel.fontSize} onChange={v => updSel({ fontSize: v })} w="34%" />
                    <div style={{ width: '32%' }}>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>Жин</div>
                      <select value={sel.weight} onChange={e => updSel({ weight: e.target.value })} style={{ width: '100%', padding: '5px 4px', fontSize: 11, fontFamily: 'var(--font-family)', border: '1px solid var(--color-border)', borderRadius: 6, outline: 'none', backgroundColor: 'var(--color-surface)' }}>
                        {['400','500','700'].map(w => <option key={w}>{w}</option>)}
                      </select>
                    </div>
                    <div style={{ width: '34%' }}>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>Зэрэгцүүлэлт</div>
                      <div style={{ display: 'flex', borderRadius: 6, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                        {['L','C','R'].map((a, i) => (
                          <div key={a} onClick={() => updSel({ align: a })} style={{
                            flex: 1, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 600, cursor: 'pointer',
                            backgroundColor: sel.align === a ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: sel.align === a ? '#fff' : 'var(--color-text-secondary)',
                            borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
                            transition: 'background-color 150ms ease-out',
                          }}>{a}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
              {sel.locked && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', borderRadius: 8, backgroundColor: 'var(--color-warning-bg)', fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--color-warning)', display: 'inline-flex', flexShrink: 0 }}><AIc d={adminIcons.lock} size={12} /></span>
                  Байрлал түгжээтэй — canvas дээр зөөх/хэмжээ өөрчлөх хаалттай. Тохиргоог засах боломжтой хэвээр.
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '28px 14px', textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)' }}>
              Canvas эсвэл давхаргаас талбар сонгоно уу
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProtoModal open={!!confirmDel} title="Талбар устгах уу?" desc={confirmDel ? `«${confirmDel.key}» талбар загвараас устана. Хэрэглэгчийн формоос ч хасагдана.` : ''} confirmLabel="Устгах" danger onConfirm={del} onCancel={() => setConfirmDel(null)} />
      <ProtoModal open={pubModal === 'confirm'} title="Загвар нийтлэх үү?" desc="«Алтан намар» бүх хэрэглэгчид харагдана. Дараа нь буцааж болно." confirmLabel="Нийтлэх" accent
        onConfirm={() => { setPubModal(null); setStatus('published'); setDirty(false); toast('Загвар нийтлэгдлээ', 'success'); }} onCancel={() => setPubModal(null)} />
      <ProtoModal open={pubModal === 'invalid'} title="Нийтлэх боломжгүй" confirmLabel="Ойлголоо" onConfirm={() => setPubModal(null)} onCancel={() => setPubModal(null)}>
        <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, backgroundColor: 'var(--color-warning-bg)' }}>
          {missing.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-warning)', padding: '2px 0' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-warning)', flexShrink: 0 }}></span>{m}
            </div>
          ))}
        </div>
      </ProtoModal>
      <ProtoModal open={leaveModal} title="Хадгалаагүй өөрчлөлт байна" desc="Гарвал сүүлийн өөрчлөлтүүд устана. Хадгалах уу?" confirmLabel="Хадгалаад гарах"
        onConfirm={() => { setLeaveModal(false); setDirty(false); toast('Хадгалагдлаа', 'success'); nav('assets'); }}
        onCancel={() => setLeaveModal(false)} />
    </div>
  );
}

const ztBtn = {
  minWidth: 24, height: 24, padding: '0 5px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
  userSelect: 'none',
};

Object.assign(window, { ProtoEditor });
