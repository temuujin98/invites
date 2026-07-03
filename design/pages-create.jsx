/* invites — Pages: Create invite flow (4 steps, desktop + mobile) */

/* Shell: top stepper bar + form left / phone preview right */
function CreateShell({ step, children, nextLabel = 'Үргэлжлүүлэх', backLabel = 'Буцах', nextVariant = 'primary' }) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: 720 }}>
      {/* Topbar */}
      <div style={{
        height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
      }}>
        <PLogo size={24} textSize={14} />
        <DSStepper steps={['Загвар', 'Мэдээлэл', 'Зураг', 'Нийтлэх']} currentStep={step} />
        <DSButton variant="ghost" size="sm">Хадгалаад гарах</DSButton>
      </div>
      <div style={{ display: 'flex', gap: 40, maxWidth: 1000, margin: '0 auto', padding: '32px 40px 48px' }}>
        {/* Form column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-muted)', padding: 28, boxShadow: 'var(--shadow-xs)',
          }}>
            {children}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border-muted)' }}>
              <DSButton variant="ghost">{backLabel}</DSButton>
              <DSButton variant={nextVariant}>{nextLabel}<ChevronIcon/></DSButton>
            </div>
          </div>
        </div>
        {/* Live preview column */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, justifyContent: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Шууд урьдчилан харах</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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

function StepHeading({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{sub}</div>
    </div>
  );
}

/* ——— Step 1: Event basic info ——— */
function CreateStep1() {
  return (
    <CreateShell step={1} backLabel="Загвар солих">
      <StepHeading title="Арга хэмжээний мэдээлэл" sub="Урилгад харагдах үндсэн мэдээллээ оруулна уу" />
      <DSInput label="Арга хэмжээний нэр" value="Анужингийн төрсөн өдөр" helper="Урилгын гарчигт томоор харагдана" />
      <DSInput label="Зохион байгуулагч / урьж буй хүн" value="Бат-Эрдэнэ гэр бүл" />
      <DSSelect label="Арга хэмжээний төрөл" value="Төрсөн өдөр" options={['Төрсөн өдөр','Хурим','Корпоратив','Төгсөлт','Хүүхэд угтах','Нээлт']} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <DSDateInput label="Огноо" value="2026.06.21" />
        <DSTimeInput label="Эхлэх цаг" value="18:00" />
      </div>
    </CreateShell>
  );
}

/* ——— Step 2: Location & details ——— */
function CreateStep2() {
  return (
    <CreateShell step={1}>
      <StepHeading title="Байршил ба дэлгэрэнгүй" sub="Зочид хаана, хэзээ очихоо мэдэх ёстой" />
      <DSInput label="Газрын нэр" value="Shangri-La Ulaanbaatar" />
      <DSInput label="Хаяг" value="Олимпийн гудамж 19А, 3 давхар" />
      <DSInput label="Google Maps линк" placeholder="https://maps.app.goo.gl/..." helper="Заавал биш — оруулбал урилган дээр «Газрын зураг» товч гарна" />
      <DSTextarea label="Тэмдэглэл / нэмэлт мэдээлэл" value="Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирэхийг хүсье." rows={3} />
    </CreateShell>
  );
}

/* ——— Step 3: Photos & media ——— */
function CreateStep3() {
  return (
    <CreateShell step={2}>
      <StepHeading title="Зураг ба медиа" sub="Үндсэн зургаа оруулаад хүрээнд тааруулаарай" />
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Үндсэн зураг</div>
      {/* Crop / position UI */}
      <div style={{
        borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)', padding: 16, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0, overflow: 'hidden', borderRadius: 8 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 8,
              background: stripeBg(45, 0.1), backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}></div>
            {/* circular crop frame */}
            <div style={{
              position: 'absolute', inset: 18, borderRadius: '50%',
              border: '2px solid var(--color-accent)',
              boxShadow: '0 0 0 200px rgba(31,29,26,0.25)',
              overflow: 'hidden',
            }}></div>
            <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center' }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#fff', backgroundColor: 'rgba(31,29,26,0.6)', padding: '1px 6px', borderRadius: 4 }}>зураг чирж байрлуул</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>Томруулах</div>
            <div style={{ position: 'relative', height: 4, borderRadius: 2, backgroundColor: 'var(--color-border)', marginBottom: 16 }}>
              <div style={{ position: 'absolute', left: 0, width: '40%', height: '100%', borderRadius: 2, backgroundColor: 'var(--color-accent)' }}></div>
              <div style={{ position: 'absolute', left: '40%', top: '50%', transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', border: '2px solid var(--color-accent)', boxShadow: 'var(--shadow-xs)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <DSButton variant="secondary" size="sm">Зураг солих</DSButton>
              <DSButton variant="ghost" size="sm">Устгах</DSButton>
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Нэмэлт зургийн цомог <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(заавал биш)</span></div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[45, 100].map((d, i) => (
          <div key={i} style={{ width: 64, height: 64, borderRadius: 8, background: stripeBg(d, 0.09), backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="2" y1="2" x2="6" y2="6"/><line x1="6" y1="2" x2="2" y2="6"/></svg>
            </div>
          </div>
        ))}
        <div style={{
          width: 64, height: 64, borderRadius: 8, border: '1.5px dashed var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', cursor: 'pointer',
        }}>
          <PlusIcon/>
        </div>
      </div>
    </CreateShell>
  );
}

/* ——— Step 4: Preview & publish ——— */
function CreateStep4() {
  return (
    <CreateShell step={3} nextLabel="Нийтлэх" nextVariant="accent" >
      <StepHeading title="Нийтлэх тохиргоо" sub="Урилгаа шалгаад зочдодоо хуваалцаарай" />
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Урилгын линк</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 4 }}>
        <span style={{
          padding: '8px 10px', fontSize: 12, color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRight: 'none',
          borderRadius: '8px 0 0 8px',
        }}>invites.mn/i/</span>
        <input readOnly value="anujin-6nas" style={{
          flex: 1, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-family)',
          border: '1px solid var(--color-border)', borderRadius: '0 8px 8px 0', outline: 'none',
          color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface)',
        }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4.5,7.5 8,3"/></svg>
        Энэ линк боломжтой байна
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>Нийтэд нээлттэй</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Линктэй хэн бүхэн урилгыг үзэх боломжтой</div>
        </div>
        <DSToggle on label="" />
      </div>
      <div style={{ marginBottom: 16 }}><DSShareLinkCard /></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <DSQRPreview />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
          <DSButton variant="secondary" size="sm">Зураг татах (PNG)</DSButton>
          <DSButton variant="secondary" size="sm">QR код татах</DSButton>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', maxWidth: 160, lineHeight: 1.5 }}>Видео хувилбар PRO багцад боломжтой</div>
        </div>
      </div>
    </CreateShell>
  );
}

/* ——— Create flow: Mobile (step 2 with collapsible preview) ——— */
function CreateMobile() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <div style={{
        padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <PLogo size={22} withText={false} />
        <span style={{ fontSize: 12, fontWeight: 500 }}>Алхам 2/4 — Мэдээлэл</span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Гарах</span>
      </div>
      {/* progress bar */}
      <div style={{ height: 3, backgroundColor: 'var(--color-border-muted)' }}>
        <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '0 2px 2px 0' }}></div>
      </div>
      {/* collapsible preview */}
      <div style={{
        margin: '12px 16px 0', borderRadius: 'var(--radius-md)', overflow: 'hidden',
        border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Урьдчилан харах</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border-muted)', maxHeight: 240, overflow: 'hidden', background: '#FDFCFA' }}>
          <InviteCard scale={0.8} frame={false} />
        </div>
      </div>
      {/* form */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Байршил ба дэлгэрэнгүй</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Зочид хаана очихоо мэдэх ёстой</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DSInput label="Газрын нэр" value="Shangri-La Ulaanbaatar" />
          <DSInput label="Хаяг" value="Олимпийн гудамж 19А, 3 давхар" />
          <DSInput label="Google Maps линк" placeholder="https://maps.app.goo.gl/..." helper="Заавал биш" />
          <DSTextarea label="Тэмдэглэл" value="Та бүхнийг хүндэт зочноор урьж байна." rows={2} />
        </div>
      </div>
      {/* sticky nav */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)',
      }}>
        <DSButton variant="secondary" size="lg" style={{ flex: 1 }}>Буцах</DSButton>
        <DSButton variant="primary" size="lg" style={{ flex: 2 }}>Үргэлжлүүлэх</DSButton>
      </div>
    </div>
  );
}

Object.assign(window, { CreateStep1, CreateStep2, CreateStep3, CreateStep4, CreateMobile });
