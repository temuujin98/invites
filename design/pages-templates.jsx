/* invites — Pages: Template listing + Template detail (desktop + mobile) */

/* ——— Listing toolbar ——— */
function ListingToolbar({ mobile }) {
  const FilterIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="2" y1="4" x2="12" y2="4"/><line x1="4" y1="7" x2="10" y2="7"/><line x1="6" y1="10" x2="8" y2="10"/></svg>;
  if (mobile) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}><DSSearchInput placeholder="Загвар хайх..." /></div>
        <DSButton variant="secondary" icon={<FilterIcon/>} style={{ height: 34 }}>Шүүлт</DSButton>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
        <DSCategoryChip label="Бүгд" active />
        <DSCategoryChip label="Төрсөн өдөр" />
        <DSCategoryChip label="Хурим" />
        <DSCategoryChip label="Корпоратив" />
        <DSCategoryChip label="Төгсөлт" />
        <DSCategoryChip label="Хүүхэд угтах" />
        <DSCategoryChip label="Нээлт" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: 220 }}><DSSearchInput placeholder="Загвар хайх..." /></div>
        <DSSelect value="Шинэ эхэндээ" options={['Шинэ эхэндээ','Их ашиглагдсан','Нэрээр']} />
      </div>
    </div>
  );
}

const listingTemplates = [
  { name: 'Цэцэгс', cat: 'Төрсөн өдөр', deg: 45 },
  { name: 'Алтан намар', cat: 'Хурим', premium: true, deg: 120 },
  { name: 'Гэрэлт үдэш', cat: 'Корпоратив', type: 'video', deg: 75 },
  { name: 'Багачууд', cat: 'Хүүхэд угтах', deg: 160 },
  { name: 'Шинэ гараа', cat: 'Нээлт', premium: true, type: 'video', deg: 30 },
  { name: 'Мөнгөн шугам', cat: 'Төгсөлт', deg: 100 },
  { name: 'Зүрхэн хээ', cat: 'Хурим', deg: 60 },
  { name: 'Однууд', cat: 'Төрсөн өдөр', type: 'video', deg: 140 },
];

/* ——— Templates: Desktop ——— */
function TemplatesDesktop() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <PublicHeader active="Загварууд" />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 48px 64px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Загварууд</h1>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>78 загвараас баярт тань тохирохыг олоорой</div>
        </div>
        <div style={{ marginBottom: 28 }}><ListingToolbar /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {listingTemplates.map((t, i) => (
            <PTemplateCard key={i} name={t.name} category={t.cat} premium={t.premium} type={t.type || 'image'} w="auto" thumbH={240} deg={t.deg} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>78-аас 1–8-г харуулж байна</span>
          <DSPagination current={1} total={10} />
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

/* ——— Templates: Desktop states (empty + loading) ——— */
function TemplatesStates() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', padding: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Loading skeleton</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[0,1,2,3].map(i => <SkeletonCard key={i} w="auto" thumbH={200} />)}
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Empty state — хайлтад илэрц алга</div>
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
        <DSEmptyState title="Загвар олдсонгүй" description="«хуримын урилга 2027» хайлтад тохирох загвар алга. Өөр түлхүүр үг туршаад үзээрэй." action={null} />
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 32, marginTop: -8 }}>
          <DSButton variant="secondary">Шүүлт арилгах</DSButton>
        </div>
      </div>
    </div>
  );
}

/* ——— Templates: Mobile (with filter drawer open) ——— */
function TemplatesMobile({ drawer = false }) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', position: 'relative', overflow: 'hidden' }}>
      <MobileHeader title="Загварууд" />
      <div style={{ padding: '16px 16px 32px' }}>
        <div style={{ marginBottom: 12 }}><ListingToolbar mobile /></div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflow: 'hidden' }}>
          <DSCategoryChip label="Бүгд" active />
          <DSCategoryChip label="Төрсөн өдөр" />
          <DSCategoryChip label="Хурим" />
          <DSCategoryChip label="Корпо..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {listingTemplates.slice(0, 6).map((t, i) => (
            <PTemplateCard key={i} name={t.name} category={t.cat} premium={t.premium} type={t.type || 'image'} w="auto" thumbH={185} deg={t.deg} />
          ))}
        </div>
      </div>
      {drawer && (
        <React.Fragment>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(31,29,26,0.4)' }}></div>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--color-surface)', borderRadius: '20px 20px 0 0',
            padding: '12px 20px 24px', boxShadow: 'var(--shadow-xl)',
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--color-border)', margin: '0 auto 16px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Шүүлт</span>
              <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500 }}>Арилгах</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Төрөл</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              <DSCategoryChip label="Бүгд" active />
              <DSCategoryChip label="Төрсөн өдөр" />
              <DSCategoryChip label="Хурим" />
              <DSCategoryChip label="Корпоратив" />
              <DSCategoryChip label="Төгсөлт" />
              <DSCategoryChip label="Нээлт" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Хэлбэр</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              <DSCategoryChip label="Зураг" active />
              <DSCategoryChip label="Видео" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Үнэ</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
              <DSCategoryChip label="Бүгд" active />
              <DSCategoryChip label="Үнэгүй" />
              <DSCategoryChip label="PRO" />
            </div>
            <DSButton variant="primary" size="lg" style={{ width: '100%' }}>24 загвар харах</DSButton>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* ——— Template detail: Desktop ——— */
function TemplateDetailDesktop() {
  const fields = ['Арга хэмжээний нэр', 'Зохион байгуулагч', 'Огноо ба цаг', 'Байршил', 'Үндсэн зураг', 'Тэмдэглэл', 'QR код'];
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <PublicHeader active="Загварууд" />
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 48px 64px' }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Загварууд <span style={{ margin: '0 6px' }}>/</span> Хурим <span style={{ margin: '0 6px' }}>/</span> <span style={{ color: 'var(--color-text-secondary)' }}>Алтан намар</span>
        </div>
        <div style={{ display: 'flex', gap: 48 }}>
          {/* Large preview */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: 380, height: 560, borderRadius: 'var(--radius-lg)',
              background: stripeBg(120, 0.07), backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>загварын том preview</span>
              <div style={{ position: 'absolute', top: 12, left: 12 }}><TypeBadge type="image" /></div>
              <span style={{ position: 'absolute', top: 12, right: 12, padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}>PRO</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              {[120, 45, 80].map((d, i) => (
                <div key={i} style={{
                  width: 52, height: 72, borderRadius: 8,
                  background: stripeBg(d, 0.08), backgroundColor: 'var(--color-surface)',
                  border: i === 0 ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}></div>
              ))}
            </div>
          </div>
          {/* Info */}
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <DSBadge variant="primary">Хурим</DSBadge>
              <DSBadge>Зургийн урилга</DSBadge>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>Алтан намар</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 420 }}>
              Намрын дулаан өнгө аястай, хуримын ёслолд зориулсан тансаг загвар. Хосын зураг, нэр, ёслолын мэдээллийг онцолсон зохиомж.
            </p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>Орлуулах боломжтой талбарууд</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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
              <DSButton variant="accent" size="lg">Энэ загвараар урилга үүсгэх</DSButton>
              <DSButton variant="secondary" size="lg">Урьдчилан үзэх</DSButton>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>PRO загвар — Стандарт багцад багтсан · 1,240 удаа ашиглагдсан</div>
          </div>
        </div>
        {/* Similar */}
        <div style={{ marginTop: 56 }}>
          <DSSectionHeader title="Төстэй загварууд" action={<DSButton variant="ghost" size="sm">Бүгдийг харах<ChevronIcon/></DSButton>} />
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <PTemplateCard name="Зүрхэн хээ" category="Хурим" deg={60} />
            <PTemplateCard name="Мөнгөн шугам" category="Хурим" deg={100} />
            <PTemplateCard name="Гэрэлт үдэш" category="Хурим" type="video" premium deg={75} />
            <PTemplateCard name="Цагаан сарнай" category="Хурим" deg={20} />
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

/* ——— Template detail: Mobile ——— */
function TemplateDetailMobile() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <MobileHeader title="Загвар" />
      <div style={{ padding: '20px 16px 24px' }}>
        <div style={{
          height: 440, borderRadius: 'var(--radius-lg)',
          background: stripeBg(120, 0.07), backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16,
        }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>загварын preview</span>
          <div style={{ position: 'absolute', top: 12, left: 12 }}><TypeBadge type="image" /></div>
          <span style={{ position: 'absolute', top: 12, right: 12, padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}>PRO</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <DSBadge variant="primary">Хурим</DSBadge>
          <DSBadge>Зургийн урилга</DSBadge>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>Алтан намар</h1>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Намрын дулаан өнгө аястай, хуримын ёслолд зориулсан тансаг загвар.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['Нэр', 'Огноо ба цаг', 'Байршил', 'Зураг', 'QR'].map(f => (
            <span key={f} style={{ padding: '4px 9px', borderRadius: 99, fontSize: 11, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>{f}</span>
          ))}
        </div>
      </div>
      {/* Sticky CTA */}
      <div style={{
        padding: '12px 16px', backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-muted)', boxShadow: '0 -4px 16px rgba(31,29,26,0.05)',
      }}>
        <DSButton variant="accent" size="lg" style={{ width: '100%' }}>Энэ загвараар урилга үүсгэх</DSButton>
      </div>
    </div>
  );
}

Object.assign(window, { TemplatesDesktop, TemplatesStates, TemplatesMobile, TemplateDetailDesktop, TemplateDetailMobile });
