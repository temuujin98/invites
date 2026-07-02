/* invites — Admin: template management (table + grid toggle + states), categories, assets */

/* ——— View toggle ——— */
function AViewToggle({ mode = 'table' }) {
  return (
    <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {[{ k: 'table', d: adminIcons.list }, { k: 'grid', d: adminIcons.grid }].map(v => (
        <div key={v.k} style={{
          width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          backgroundColor: mode === v.k ? 'var(--color-primary)' : 'var(--color-surface)',
          color: mode === v.k ? '#fff' : 'var(--color-text-secondary)',
        }}><AIc d={v.d} size={13} /></div>
      ))}
    </div>
  );
}

const admTplRows = [
  { name: 'Алтан намар', cat: 'Хурим', type: 'video' === 'x' ? 'video' : 'image', status: 'published', date: '2026.06.09', deg: 120, premium: true },
  { name: 'Гэрэлт үдэш', cat: 'Корпоратив', type: 'video', status: 'draft', date: '2026.06.08', deg: 75 },
  { name: 'Цэцэгс', cat: 'Төрсөн өдөр', type: 'image', status: 'published', date: '2026.06.05', deg: 45 },
  { name: 'Багачууд', cat: 'Хүүхэд угтах', type: 'image', status: 'published', date: '2026.06.01', deg: 160 },
  { name: 'Шинэ гараа', cat: 'Нээлт', type: 'video', status: 'draft', date: '2026.05.28', deg: 30, premium: true },
];

function AdminTemplatesFilters({ mode }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
      <div style={{ width: 220 }}><DSSearchInput placeholder="Загвар хайх..." /></div>
      <DSSelect value="Бүх ангилал" options={['Бүх ангилал','Хурим','Төрсөн өдөр']} />
      <DSSelect value="Бүх төрөл" options={['Бүх төрөл','Зураг','Видео']} />
      <DSSelect value="Бүх төлөв" options={['Бүх төлөв','Нийтлэгдсэн','Ноорог']} />
      <div style={{ flex: 1 }}></div>
      <AViewToggle mode={mode} />
    </div>
  );
}

/* ——— Template management: table view ——— */
function AdminTemplates() {
  return (
    <AdminShell active="Загварууд" title="Загварууд" actions={<DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Загвар үүсгэх</DSButton>}>
      <AdminTemplatesFilters mode="table" />
      <ATable head={[
        { label: 'Загвар' }, { label: 'Ангилал', w: 120 }, { label: 'Төрөл', w: 90 },
        { label: 'Төлөв', w: 110 }, { label: 'Шинэчлэгдсэн', w: 110 }, { label: '', w: 175, right: true },
      ]}>
        {admTplRows.map((r, i) => (
          <tr key={i}>
            <ATd>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AThumb deg={r.deg} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{r.name}{r.premium && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: 'var(--color-accent)' }}>PRO</span>}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>1080×1920 · story</div>
                </div>
              </div>
            </ATd>
            <ATd><DSBadge>{r.cat}</DSBadge></ATd>
            <ATd>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                <AIc d={r.type === 'video' ? adminIcons.video : adminIcons.image} size={12} />
                {r.type === 'video' ? 'Видео' : 'Зураг'}
              </span>
            </ATd>
            <ATd><DSStatusBadge status={r.status} /></ATd>
            <ATd muted>{r.date}</ATd>
            <ATd right>
              <div style={{ display: 'inline-flex', gap: 5 }}>
                <ARowAction icon={adminIcons.edit} title="Засах" />
                <ARowAction icon={adminIcons.copy} title="Хувилах" />
                <ARowAction icon={adminIcons.eye} title="Урьдчилан үзэх" />
                <ARowAction icon={adminIcons.globe} title={r.status === 'published' ? 'Нийтлэлээс буцаах' : 'Нийтлэх'} />
                <ARowAction icon={adminIcons.trash} danger title="Устгах" />
              </div>
            </ATd>
          </tr>
        ))}
      </ATable>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>78-аас 1–5-г харуулж байна</span>
        <DSPagination current={1} total={16} />
      </div>
    </AdminShell>
  );
}

/* ——— Template management: grid view + states ——— */
function AdminTemplatesGrid() {
  return (
    <AdminShell active="Загварууд" title="Загварууд" actions={<DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Загвар үүсгэх</DSButton>}>
      <AdminTemplatesFilters mode="grid" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {admTplRows.slice(0, 4).map((r, i) => (
          <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
            <div style={{ height: 170, background: stripeBg(r.deg, 0.08), backgroundColor: 'var(--color-bg)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>thumbnail</span>
              <div style={{ position: 'absolute', top: 8, left: 8 }}><TypeBadge type={r.type} /></div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</span>
                <DSStatusBadge status={r.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{r.cat}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <ARowAction icon={adminIcons.edit} title="Засах" />
                  <ARowAction icon={adminIcons.copy} title="Хувилах" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* states */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Loading skeleton</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SkeletonCard w="auto" thumbH={130} />
            <SkeletonCard w="auto" thumbH={130} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Empty state</div>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
            <DSEmptyState title="Загвар алга" description="Эхний загвараа үүсгэж, фон файлаа оруулаарай" action="Загвар үүсгэх" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ——— Category management ——— */
function AdminCategories() {
  const cats = [
    { mn: 'Төрсөн өдөр', en: 'Birthday', slug: 'birthday', count: 24, on: true },
    { mn: 'Хурим', en: 'Wedding', slug: 'wedding', count: 18, on: true },
    { mn: 'Корпоратив', en: 'Corporate', slug: 'corporate', count: 12, on: true },
    { mn: 'Төгсөлт', en: 'Graduation', slug: 'graduation', count: 9, on: true },
    { mn: 'Хүүхэд угтах', en: 'Baby Shower', slug: 'baby-shower', count: 7, on: false },
    { mn: 'Нээлт', en: 'Opening', slug: 'opening', count: 8, on: true },
  ];
  return (
    <AdminShell active="Ангилал" title="Ангилал" actions={<DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Ангилал нэмэх</DSButton>}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <ATable head={[
            { label: '', w: 36 }, { label: 'Нэр (MN)' }, { label: 'Нэр (EN)', w: 120 }, { label: 'Slug', w: 120 },
            { label: 'Загвар', w: 70, right: true }, { label: 'Идэвхтэй', w: 80 }, { label: '', w: 70, right: true },
          ]}>
            {cats.map((c, i) => (
              <tr key={i}>
                <ATd><span style={{ color: 'var(--color-text-muted)', cursor: 'grab', display: 'inline-flex' }}><AIc d={adminIcons.drag} size={14} sw={2.2} /></span></ATd>
                <ATd style={{ fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AIc d={adminIcons.categories} size={12} /></div>
                    {c.mn}
                  </div>
                </ATd>
                <ATd muted>{c.en}</ATd>
                <ATd muted><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{c.slug}</span></ATd>
                <ATd right muted>{c.count}</ATd>
                <ATd><DSToggle on={c.on} label="" /></ATd>
                <ATd right>
                  <div style={{ display: 'inline-flex', gap: 5 }}>
                    <ARowAction icon={adminIcons.edit} title="Засах" />
                    <ARowAction icon={adminIcons.trash} danger title="Устгах" />
                  </div>
                </ATd>
              </tr>
            ))}
          </ATable>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <AIc d={adminIcons.drag} size={11} sw={2} /> Мөрийг чирж эрэмбэлнэ — нүүр хуудасны дараалалд шууд нөлөөлнө
          </div>
        </div>
        {/* Create/edit modal */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Create / Edit modal</div>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Ангилал засах</div>
              <DSInput label="Нэр (Монгол)" value="Хүүхэд угтах" />
              <DSInput label="Нэр (English)" value="Baby Shower" helper="Заавал биш — экспортод хэрэглэгдэнэ" />
              <DSInput label="Slug" value="baby-shower" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>Идэвхтэй</span>
                <DSToggle on={false} label="" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--color-border-muted)', marginTop: 14 }}>
              <DSButton variant="ghost" size="sm">Болих</DSButton>
              <DSButton variant="primary" size="sm">Хадгалах</DSButton>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ——— Asset library ——— */
function AdminAssets() {
  const assets = [
    { name: 'altan-namar-bg.png', type: 'PNG', size: '2.4 MB', used: 1, deg: 120 },
    { name: 'gerelt-udesh.mp4', type: 'MP4', size: '18.6 MB', used: 1, deg: 75, video: true },
    { name: 'tsetsegs-bg.png', type: 'PNG', size: '1.9 MB', used: 2, deg: 45 },
    { name: 'bagachuud-bg.png', type: 'PNG', size: '2.1 MB', used: 0, deg: 160 },
    { name: 'shine-garaa.mp4', type: 'MP4', size: '24.2 MB', used: 1, deg: 30, video: true },
  ];
  return (
    <AdminShell active="Файлын сан" title="Файлын сан" actions={<DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Файл оруулах</DSButton>}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 220 }}><DSSearchInput placeholder="Файл хайх..." /></div>
        <DSSelect value="Бүх төрөл" options={['Бүх төрөл','PNG/JPG','MP4']} />
        <DSSelect value="Бүгд" options={['Бүгд','Ашиглагдсан','Ашиглагдаагүй']} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {/* upload tile */}
        <div style={{
          borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--color-border)',
          minHeight: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, cursor: 'pointer', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)',
        }}>
          <div style={{ color: 'var(--color-accent)' }}><AIc d={adminIcons.upload} size={20} /></div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Файл чирж оруулах</div>
          <div style={{ fontSize: 10 }}>PNG, JPG, MP4 · 50MB хүртэл</div>
        </div>
        {assets.map((a, i) => (
          <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)' }}>
            <div style={{ height: 120, background: stripeBg(a.deg, 0.08), backgroundColor: 'var(--color-bg)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {a.video && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(31,29,26,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 2.5l6 3.5-6 3.5v-7z"/></svg>
                </div>
              )}
              <span style={{ position: 'absolute', top: 6, left: 6, padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, backgroundColor: 'rgba(31,29,26,0.65)', color: '#fff' }}>{a.type}</span>
            </div>
            <div style={{ padding: '9px 11px' }}>
              <div style={{ fontSize: 11, fontWeight: 500, fontFamily: 'monospace', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{a.size} · {a.used > 0 ? `${a.used} загварт` : 'ашиглагдаагүй'}</span>
                {a.used > 0
                  ? <span title="Загварт ашиглагдаж байгаа тул устгах боломжгүй" style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}><AIc d={adminIcons.lock} size={12} /></span>
                  : <ARowAction icon={adminIcons.trash} danger title="Устгах" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warning-bg)', maxWidth: 520,
      }}>
        <span style={{ color: 'var(--color-warning)', display: 'inline-flex' }}><AIc d={adminIcons.warn} size={14} /></span>
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Загварт ашиглагдаж буй файлыг эхлээд загвараас нь салгаж байж устгана.</span>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminTemplates, AdminTemplatesGrid, AdminCategories, AdminAssets, AViewToggle });
