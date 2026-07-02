/* invites — Admin: template editor (3-panel) + mobile tabs + field→form preview */

/* ——— Editor panel primitives ——— */
function EPanelTitle({ children, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)' }}>{children}</span>
      {right}
    </div>
  );
}

function EMiniInput({ label, value, w }) {
  return (
    <div style={{ width: w }}>
      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>{label}</div>
      <input readOnly value={value} style={{
        width: '100%', padding: '5px 8px', fontSize: 11, fontFamily: 'var(--font-family)',
        border: '1px solid var(--color-border)', borderRadius: 6, outline: 'none',
        color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface)', boxSizing: 'border-box',
      }} />
    </div>
  );
}

function ESegment({ options, active }) {
  return (
    <div style={{ display: 'flex', borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {options.map((o, i) => (
        <div key={i} style={{
          flex: 1, padding: '6px 0', textAlign: 'center', fontSize: 11, fontWeight: 500, cursor: 'pointer',
          backgroundColor: o === active ? 'var(--color-primary)' : 'var(--color-surface)',
          color: o === active ? '#fff' : 'var(--color-text-secondary)',
          borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
        }}>{o}</div>
      ))}
    </div>
  );
}

/* ——— Left panel: template settings ——— */
function EditorSettingsPanel() {
  return (
    <div style={{ width: 240, flexShrink: 0, backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border-muted)', padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <EPanelTitle>Загварын тохиргоо</EPanelTitle>
        <DSInput label="Нэр" value="Алтан намар" />
        <DSInput label="Slug" value="altan-namar" />
        <DSSelect label="Ангилал" value="Хурим" options={['Хурим','Төрсөн өдөр']} />
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Төрөл</div>
        <ESegment options={['Зураг', 'Видео']} active="Зураг" />
      </div>
      <div>
        <EPanelTitle>Фон файл</EPanelTitle>
        <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
          <AThumb deg={120} w={34} h={46} r={5} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>altan-namar-bg.png</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>2.4 MB · 1080×1920</div>
          </div>
          <ARowAction icon={adminIcons.upload} title="Солих" />
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Thumbnail</div>
          <div style={{ borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--color-border)', padding: '12px 10px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Зураг оруулах</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>хоосон бол автоматаар үүснэ</div>
          </div>
        </div>
      </div>
      <div>
        <EPanelTitle>Canvas хэмжээ</EPanelTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { l: 'Story', s: '1080×1920', on: true },
            { l: 'Square', s: '1080×1080' },
            { l: 'Landscape', s: '1920×1080' },
            { l: 'Custom', s: '...' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '7px 9px', borderRadius: 8, cursor: 'pointer',
              border: c.on ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
              backgroundColor: c.on ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: c.on ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{c.l}</div>
              <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Төлөв</span>
          <DSStatusBadge status="draft" />
        </div>
        <DSButton variant="accent" style={{ width: '100%' }}>Нийтлэх</DSButton>
      </div>
    </div>
  );
}

/* ——— Center: visual canvas ——— */
function EditorCanvas() {
  const fieldBox = (top, left, w, label, opts = {}) => (
    <div style={{
      position: 'absolute', top, left, width: w,
      border: opts.selected ? '1.5px solid var(--color-accent)' : '1px dashed rgba(139,92,246,0.55)',
      borderRadius: opts.round ? '50%' : 3, padding: opts.pad ?? '3px 4px',
      textAlign: 'center', cursor: 'move', height: opts.h,
      backgroundColor: opts.selected ? 'rgba(139,92,246,0.06)' : 'transparent',
      boxSizing: 'border-box',
    }}>
      {opts.selected && (
        <React.Fragment>
          {[['-4px','-4px'],['-4px','calc(50% - 3px)'],['-4px','calc(100% - 3px)'],['calc(50% - 3px)','-4px'],['calc(50% - 3px)','calc(100% - 3px)'],['calc(100% - 3px)','-4px'],['calc(100% - 3px)','calc(50% - 3px)'],['calc(100% - 3px)','calc(100% - 3px)']].map((p, i) => (
            <div key={i} style={{ position: 'absolute', top: p[0], left: p[1], width: 7, height: 7, backgroundColor: '#fff', border: '1.5px solid var(--color-accent)', borderRadius: 1.5 }}></div>
          ))}
          <div style={{
            position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)',
            padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
            backgroundColor: 'var(--color-accent)', color: '#fff', fontFamily: 'monospace',
          }}>event_title · 920×140 · x80 y560</div>
        </React.Fragment>
      )}
      {label}
    </div>
  );
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#211F1C' }}>
      {/* Canvas toolbar */}
      <div style={{
        height: 40, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 14,
        backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['−', '74%', '+'].map((z, i) => (
            <div key={i} style={{
              minWidth: 24, height: 24, padding: '0 5px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}>{z}</div>
          ))}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 4, cursor: 'pointer' }}>Багтаах</span>
        </div>
        <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.12)' }}></div>
        {[
          { l: 'Safe area', on: true },
          { l: 'Жишээ дата', on: true },
          { l: 'Mobile preview', on: false },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div style={{
              width: 24, height: 14, borderRadius: 7, padding: 2, boxSizing: 'border-box',
              backgroundColor: t.on ? 'var(--color-accent)' : 'rgba(255,255,255,0.18)',
              display: 'flex', justifyContent: t.on ? 'flex-end' : 'flex-start',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fff' }}></div>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{t.l}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>1080×1920 · story</div>
      </div>
      {/* Canvas area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ position: 'relative', width: 300, height: 533, flexShrink: 0 }}>
          {/* background */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden',
            background: stripeBg(120, 0.12), backgroundColor: '#F4F1EB',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 9, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>фон: altan-namar-bg.png</span>
          </div>
          {/* safe area guide */}
          <div style={{ position: 'absolute', inset: 22, border: '1px dashed rgba(139,92,246,0.4)', borderRadius: 4, pointerEvents: 'none' }}></div>
          {/* overlay fields */}
          {fieldBox(60, 100, 100, <div style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>main_photo</div>, { round: true, h: 100, pad: 0 })}
          {fieldBox(180, 22, 256, <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>Болд & Сараа</span>, { selected: true })}
          {fieldBox(218, 60, 180, <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>Хуримын ёслолд урьж байна</span>)}
          {fieldBox(280, 60, 180, <span style={{ fontSize: 10, fontWeight: 500 }}>2026.09.14 · 17:00</span>)}
          {fieldBox(310, 45, 210, <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>Туушин зочид буудал, Их танхим</span>)}
          {fieldBox(420, 120, 60, <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>qr_code</div>, { h: 60, pad: 0 })}
        </div>
      </div>
    </div>
  );
}

/* ——— Right panel: layers + selected field settings ——— */
function EditorFieldsPanel() {
  const layers = [
    { key: 'main_photo', icon: adminIcons.photo, vis: true },
    { key: 'event_title', icon: adminIcons.text, vis: true, selected: true },
    { key: 'subtitle', icon: adminIcons.text, vis: true },
    { key: 'event_datetime', icon: adminIcons.date, vis: true },
    { key: 'location', icon: adminIcons.pin, vis: true, locked: true },
    { key: 'qr_code', icon: adminIcons.qr, vis: false },
  ];
  return (
    <div style={{ width: 268, flexShrink: 0, backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border-muted)', display: 'flex', flexDirection: 'column' }}>
      {/* Layers */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-border-muted)' }}>
        <EPanelTitle right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', cursor: 'pointer' }}>
            <AIc d={adminIcons.plus} size={11} sw={2} /><span style={{ fontSize: 11, fontWeight: 500 }}>Талбар нэмэх</span>
          </div>
        }>Давхарга (6)</EPanelTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {layers.map((l, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 7,
              backgroundColor: l.selected ? 'var(--color-accent-subtle)' : 'transparent',
              border: l.selected ? '1px solid #DBC9F9' : '1px solid transparent',
              cursor: 'pointer', opacity: l.vis ? 1 : 0.45,
            }}>
              <span style={{ color: 'var(--color-text-muted)', cursor: 'grab', display: 'inline-flex' }}><AIc d={adminIcons.drag} size={12} sw={2.4} /></span>
              <span style={{ color: l.selected ? 'var(--color-accent)' : 'var(--color-text-secondary)', display: 'inline-flex' }}><AIc d={l.icon} size={13} /></span>
              <span style={{ flex: 1, fontSize: 11, fontWeight: l.selected ? 600 : 400, fontFamily: 'monospace', color: l.selected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{l.key}</span>
              <span title="Байрлал түгжих — canvas дээр зөөх/хэмжээ өөрчлөхийг хаана. Тохиргоог засах боломжтой хэвээр." style={{ color: l.locked ? 'var(--color-warning)' : 'var(--color-text-muted)', display: 'inline-flex', opacity: l.locked ? 1 : 0.5 }}><AIc d={l.locked ? adminIcons.lock : adminIcons.unlock} size={11} /></span>
              <span style={{ color: 'var(--color-text-muted)', display: 'inline-flex', opacity: l.vis ? 0.5 : 1 }}><AIc d={adminIcons.eye} size={12} /></span>
            </div>
          ))}
        </div>
      </div>
      {/* Selected field settings */}
      <div style={{ padding: 16, flex: 1, overflow: 'hidden' }}>
        <EPanelTitle right={
          <div style={{ display: 'flex', gap: 5 }}>
            <ARowAction icon={adminIcons.copy} title="Хувилах" />
            <ARowAction icon={adminIcons.trash} danger title="Устгах" />
          </div>
        }>Талбарын тохиргоо</EPanelTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '6px 9px', borderRadius: 7, backgroundColor: 'var(--color-bg)' }}>
          <AIc d={adminIcons.text} size={12} />
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>event_title</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)' }}>Text</span>
        </div>
        <DSInput label="Хэрэглэгчид харагдах нэр" value="Арга хэмжээний нэр" />
        <DSInput label="Placeholder" value="Жнь: Болд & Сараа" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Заавал бөглөх</span>
          <DSToggle on label="" />
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <EMiniInput label="X" value="80" w="25%" />
          <EMiniInput label="Y" value="560" w="25%" />
          <EMiniInput label="W" value="920" w="25%" />
          <EMiniInput label="H" value="140" w="25%" />
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 2 }}><DSSelect label="Фонт" value="Roboto" options={['Roboto']} /></div>
          <div style={{ flex: 1 }}><DSSelect label="Жин" value="700" options={['400','500','700']} /></div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'flex-end' }}>
          <EMiniInput label="Хэмжээ" value="64" w="27%" />
          <EMiniInput label="Мөр хоорондын зай" value="1.2" w="27%" />
          <EMiniInput label="Макс тэмдэгт" value="40" w="30%" />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>Өнгө</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 8px' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: '#1F1D1A', border: '1px solid var(--color-border)' }}></div>
              <span style={{ fontSize: 11, fontFamily: 'monospace' }}>#1F1D1A</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>Зэрэгцүүлэлт</div>
            <div style={{ display: 'flex', borderRadius: 6, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {['L','C','R'].map((a, i) => (
                <div key={i} style={{
                  width: 26, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, cursor: 'pointer',
                  backgroundColor: a === 'C' ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: a === 'C' ? '#fff' : 'var(--color-text-secondary)',
                  borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
                }}>{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Template editor: full desktop ——— */
function AdminEditor() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', minHeight: 860, backgroundColor: 'var(--color-bg)' }}>
      {/* Editor topbar */}
      <div style={{
        height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 14,
        backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
      }}>
        <DSButton variant="ghost" size="sm">← Загварууд</DSButton>
        <div style={{ width: 1, height: 18, backgroundColor: 'var(--color-border-muted)' }}></div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Алтан намар</span>
        <DSStatusBadge status="draft" />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Хадгалагдсан · сая</span>
          <DSButton variant="secondary" size="sm">Урьдчилан үзэх</DSButton>
          <DSButton variant="accent" size="sm">Нийтлэх</DSButton>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <EditorSettingsPanel />
        <EditorCanvas />
        <EditorFieldsPanel />
      </div>
    </div>
  );
}

/* ——— Editor: mobile (tabs) ——— */
function AdminEditorMobile() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', minHeight: 720 }}>
      <div style={{ padding: '10px 14px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>←</span>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Алтан намар</span>
        <DSStatusBadge status="draft" />
        <DSButton variant="accent" size="sm">Нийтлэх</DSButton>
      </div>
      <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)', padding: '0 14px' }}>
        <DSTabs tabs={['Тохиргоо', 'Canvas', 'Талбарууд']} activeIndex={1} />
      </div>
      <div style={{ flex: 1, backgroundColor: '#211F1C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 14 }}>
        <div style={{ position: 'relative', width: 240, height: 427 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: stripeBg(120, 0.12), backgroundColor: '#F4F1EB', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}></div>
          <div style={{ position: 'absolute', inset: 18, border: '1px dashed rgba(139,92,246,0.4)', borderRadius: 4 }}></div>
          <div style={{
            position: 'absolute', top: 150, left: 18, width: 204, padding: '3px 4px', textAlign: 'center',
            border: '1.5px solid var(--color-accent)', borderRadius: 3, backgroundColor: 'rgba(139,92,246,0.06)',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Болд & Сараа</span>
            <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>event_title</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['−', '60%', '+'].map((z, i) => (
            <div key={i} style={{ minWidth: 28, height: 28, padding: '0 6px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500 }}>{z}</div>
          ))}
        </div>
      </div>
      {/* selected-field quick bar */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AIc d={adminIcons.text} size={13} />
        <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>event_title</span>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>64px · 700 · Center</span>
        <div style={{ marginLeft: 'auto' }}><DSButton variant="secondary" size="sm">Тохиргоо нээх</DSButton></div>
      </div>
    </div>
  );
}

/* ——— Field → generated user form preview ——— */
function FieldFormPreview() {
  const fields = [
    { key: 'event_title', type: 'Text', icon: adminIcons.text, label: 'Арга хэмжээний нэр' },
    { key: 'host_name', type: 'Text', icon: adminIcons.text, label: 'Зохион байгуулагч' },
    { key: 'event_date', type: 'Date', icon: adminIcons.date, label: 'Огноо' },
    { key: 'event_time', type: 'Time', icon: adminIcons.clock, label: 'Цаг' },
    { key: 'location', type: 'Location', icon: adminIcons.pin, label: 'Байршил' },
    { key: 'main_photo', type: 'Image', icon: adminIcons.photo, label: 'Үндсэн зураг' },
  ];
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', padding: 28 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Талбараас форм автоматаар үүсэх зарчим</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Админы тодорхойлсон талбар бүр хэрэглэгчийн формын нэг input болно</div>
      </div>
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', justifyContent: 'center' }}>
        {/* Admin side */}
        <div style={{ width: 290, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: '#CBB8F7', padding: '2px 6px', borderRadius: 4 }}>ADMIN</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Загварын талбарууд</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {fields.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-bg)' }}>
                <span style={{ color: 'var(--color-accent)', display: 'inline-flex' }}><AIc d={f.icon} size={13} /></span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, flex: 1 }}>{f.key}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{f.type}</span>
              </div>
            ))}
          </div>
        </div>
        {/* arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', gap: 6 }}>
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10h30M26 4l6 6-6 6"/></svg>
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center' }}>автоматаар<br/>үүснэ</span>
        </div>
        {/* User side */}
        <div style={{ width: 320, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-muted)', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: '#fff', backgroundColor: 'var(--color-accent)', padding: '2px 6px', borderRadius: 4 }}>ХЭРЭГЛЭГЧ</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Үүссэн форм</span>
          </div>
          <DSInput label="Арга хэмжээний нэр" placeholder="Жнь: Болд & Сараа" />
          <DSInput label="Зохион байгуулагч" placeholder="Таны нэр" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
            <DSDateInput label="Огноо" value="2026.09.14" />
            <DSTimeInput label="Цаг" value="17:00" />
          </div>
          <DSInput label="Байршил" placeholder="Газрын нэр, хаяг" />
          <DSFileUpload label="Үндсэн зураг" />
        </div>
        {/* phone preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: 24, gap: 8 }}>
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'top center' }}>
            <DSPhonePreviewFrame>
              <div style={{ height: '100%', overflow: 'hidden', backgroundColor: '#FDFCFA' }}>
                <InviteCard scale={0.92} frame={false} />
              </div>
            </DSPhonePreviewFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminEditor, AdminEditorMobile, FieldFormPreview, EditorSettingsPanel, EditorCanvas, EditorFieldsPanel });
