/* invites — Prototype: create invite flow (4 steps + publish + success) */

/* Controlled input primitives */
function PInput({ label, value, onChange, placeholder, helper, error, icon, half }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ marginBottom: 12, gridColumn: half ? 'span 1' : undefined }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>{icon}</div>}
        <input value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', boxSizing: 'border-box', padding: icon ? '8px 12px 8px 32px' : '8px 12px',
            fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', outline: 'none',
            border: `1px solid ${error ? 'var(--color-danger)' : focus ? 'var(--color-accent)' : 'var(--color-border)'}`,
            boxShadow: error ? '0 0 0 3px var(--color-danger-bg)' : focus ? '0 0 0 3px var(--color-accent-subtle)' : 'none',
            transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
          }} />
      </div>
      {helper && !error && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{helper}</div>}
      {error && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function PTextarea({ label, value, onChange, rows = 3 }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      <textarea value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '8px 12px', resize: 'vertical', minHeight: rows * 20 + 16,
          fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', outline: 'none',
          border: `1px solid ${focus ? 'var(--color-accent)' : 'var(--color-border)'}`,
          boxShadow: focus ? '0 0 0 3px var(--color-accent-subtle)' : 'none',
          transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
        }} />
    </div>
  );
}

/* ——— Create flow ——— */
function ProtoCreate() {
  const { nav, params, invite, setInvite, toast, publishInvite } = useProto();
  const tpl = protoTemplates.find(t => t.id === params.tpl) || protoTemplates[0];
  const [step, setStep] = React.useState(params.step || 0);
  const [errors, setErrors] = React.useState({});
  const [publishing, setPublishing] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const set = (k) => (v) => { setInvite(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const stepsLabels = ['Мэдээлэл', 'Байршил', 'Зураг', 'Нийтлэх'];

  /* ——— slug availability (fake async check) ——— */
  const [slugState, setSlugState] = React.useState('ok'); // checking | ok | taken | invalid
  const slugTimer = React.useRef(null);
  const onSlug = (v) => {
    set('slug')(v);
    setSlugState('checking');
    clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(() => {
      if (!/^[a-z0-9-]+$/.test(v) || !v) setSlugState('invalid');
      else if (v === 'bold-saraa' || v === 'anujin') setSlugState('taken');
      else setSlugState('ok');
    }, 700);
  };

  const next = () => {
    if (step === 0) {
      const e = {};
      if (!invite.title.trim()) e.title = 'Арга хэмжээний нэр заавал шаардлагатай';
      if (!invite.host.trim()) e.host = 'Урьж буй хүний нэр шаардлагатай';
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    if (step < 3) setStep(step + 1);
    else { if (slugState !== 'ok') { toast('Линкээ засаад дахин оролдоорой', 'warning'); return; } doPublish(); }
  };

  const doPublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
      publishInvite();
      toast('Урилга амжилттай нийтлэгдлээ', 'success');
    }, 1400);
  };

  const copyLink = () => {
    setCopied(true);
    toast('Линк хуулагдлаа', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (published) return <ProtoPublishSuccess tpl={tpl} copyLink={copyLink} copied={copied} />;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh' }}>
      <div style={{
        height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div onClick={() => nav('detail', { tpl: tpl.id })} style={{ cursor: 'pointer' }}><PLogo size={24} textSize={14} /></div>
        <DSStepper steps={['Загвар', ...stepsLabels.slice(0, 3)]} currentStep={step + 1} />
        <span onClick={() => { toast('Ноорог хадгалагдлаа', 'success'); nav('dashboard'); }}>
          <DSButton variant="ghost" size="sm">Хадгалаад гарах</DSButton>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 40, maxWidth: 1000, margin: '0 auto', padding: '32px 40px 48px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div key={step} style={{
            backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-muted)', padding: 28, boxShadow: 'var(--shadow-xs)',
            animation: 'protoStepIn 240ms ease-out',
          }}>
            {step === 0 && (
              <React.Fragment>
                <StepHead title="Арга хэмжээний мэдээлэл" sub="Урилгад харагдах үндсэн мэдээллээ оруулна уу" />
                <PInput label="Арга хэмжээний нэр *" value={invite.title} onChange={set('title')} placeholder="Жнь: Анужингийн төрсөн өдөр" error={errors.title} helper={!errors.title ? 'Урилгын гарчигт томоор харагдана' : null} />
                <PInput label="Зохион байгуулагч / урьж буй хүн *" value={invite.host} onChange={set('host')} placeholder="Жнь: Бат-Эрдэнэ, Солонго нар" error={errors.host} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <PInput half label="Огноо" value={invite.date} onChange={set('date')} icon={<CalendarIcon/>} />
                  <PInput half label="Эхлэх цаг" value={invite.time} onChange={set('time')} icon={<ClockIcon/>} />
                </div>
                <PInput label="Хариу авах утас (RSVP)" value={invite.phone} onChange={set('phone')} placeholder="9911-2233" />
              </React.Fragment>
            )}
            {step === 1 && (
              <React.Fragment>
                <StepHead title="Байршил ба дэлгэрэнгүй" sub="Зочид хаана, хэзээ очихоо мэдэх ёстой" />
                <PInput label="Газрын нэр" value={invite.venue} onChange={set('venue')} />
                <PInput label="Хаяг" value={invite.address} onChange={set('address')} />
                <PInput label="Google Maps линк" value={invite.maps} onChange={set('maps')} placeholder="https://maps.app.goo.gl/..." helper="Заавал биш — оруулбал урилган дээр «Газрын зураг» товч гарна" />
                <PTextarea label="Тэмдэглэл / нэмэлт мэдээлэл" value={invite.note} onChange={set('note')} />
              </React.Fragment>
            )}
            {step === 2 && (
              <React.Fragment>
                <StepHead title="Зураг ба медиа" sub="Үндсэн зургаа оруулаад хүрээнд тааруулаарай" />
                {!invite.photo ? (
                  <div onClick={() => { set('photo')(true); toast('Зураг амжилттай орлоо', 'success'); }} style={{
                    padding: '32px 16px', textAlign: 'center', cursor: 'pointer',
                    border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)', transition: 'border-color 200ms ease-out',
                  }}>
                    <div style={{ color: 'var(--color-accent)', marginBottom: 8, display: 'flex', justifyContent: 'center' }}><UploadIcon/></div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>Зураг чирж оруулах эсвэл дарж сонгох</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>PNG, JPG · 5MB хүртэл</div>
                  </div>
                ) : (
                  <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', padding: 16 }}>
                    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0, overflow: 'hidden', borderRadius: '50%', border: '2px solid var(--color-accent)' }}>
                        <div style={{
                          position: 'absolute', inset: 0, transform: `scale(${1 + invite.photoZoom / 100})`,
                          background: 'radial-gradient(circle at 38% 32%, #E9DDF8 0%, #C9A86A 55%, #8B6F44 100%)',
                          transition: 'transform 120ms ease-out',
                        }}></div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>Томруулах — {invite.photoZoom}%</div>
                        <input type="range" min="0" max="100" value={invite.photoZoom}
                          onChange={e => set('photoZoom')(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-accent)', marginBottom: 14 }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span onClick={() => toast('Зураг солигдлоо', 'info')}><DSButton variant="secondary" size="sm">Зураг солих</DSButton></span>
                          <span onClick={() => set('photo')(false)}><DSButton variant="ghost" size="sm">Устгах</DSButton></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
            {step === 3 && (
              <React.Fragment>
                <StepHead title="Нийтлэх тохиргоо" sub="Урилгаа шалгаад зочдодоо хуваалцаарай" />
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Урилгын линк</div>
                <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: 6 }}>
                  <span style={{ padding: '8px 10px', fontSize: 12, color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRight: 'none', borderRadius: '8px 0 0 8px' }}>invites.mn/i/</span>
                  <input value={invite.slug} onChange={e => onSlug(e.target.value)} style={{
                    flex: 1, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-family)',
                    border: `1px solid ${slugState === 'taken' || slugState === 'invalid' ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    borderRadius: '0 8px 8px 0', outline: 'none',
                  }} />
                </div>
                <div style={{ minHeight: 30, marginBottom: 8 }}>
                  {slugState === 'checking' && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="proto-spinner" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}></span>
                      Шалгаж байна...
                    </div>
                  )}
                  {slugState === 'ok' && (
                    <div style={{ fontSize: 11, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4.5,7.5 8,3"/></svg>
                      Энэ линк боломжтой байна
                    </div>
                  )}
                  {slugState === 'taken' && (
                    <div style={{ fontSize: 11, color: 'var(--color-danger)' }}>
                      Энэ линк аль хэдийн ашиглагдсан байна — санал: {' '}
                      <span onClick={() => onSlug(invite.slug + '-2026')} style={{ color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}>{invite.slug}-2026</span>
                    </div>
                  )}
                  {slugState === 'invalid' && (
                    <div style={{ fontSize: 11, color: 'var(--color-danger)', lineHeight: 1.5 }}>
                      Буруу тэмдэгт — зөвхөн жижиг латин үсэг (a–z), тоо (0–9), зураас (-) ашиглана уу
                    </div>
                  )}
                </div>
                <div onClick={() => set('isPublic')(!invite.isPublic)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                  padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: 8,
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>Нийтэд нээлттэй</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Линктэй хэн бүхэн урилгыг үзэх боломжтой</div>
                  </div>
                  <DSToggle on={invite.isPublic} label="" />
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  «Нийтлэх» дарсны дараа линк идэвхжиж, QR код болон татах сонголтууд гарна.
                </div>
              </React.Fragment>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border-muted)' }}>
              <span onClick={() => step === 0 ? nav('detail', { tpl: tpl.id }) : setStep(step - 1)}>
                <DSButton variant="ghost">{step === 0 ? 'Загвар солих' : 'Буцах'}</DSButton>
              </span>
              <span onClick={publishing ? undefined : next}>
                <DSButton variant={step === 3 ? 'accent' : 'primary'} disabled={publishing}>
                  {publishing ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <span className="proto-spinner"></span>Нийтэлж байна...
                    </span>
                  ) : step === 3 ? 'Нийтлэх' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>Үргэлжлүүлэх<ChevronIcon/></span>}
                </DSButton>
              </span>
            </div>
          </div>
        </div>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, justifyContent: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Шууд урьдчилан харах</span>
            </div>
            <DSPhonePreviewFrame>
              <div style={{ height: '100%', overflow: 'hidden', backgroundColor: '#FDFCFA' }}>
                <LiveInviteCard d={invite} scale={0.94} artKind={tpl.art} />
              </div>
            </DSPhonePreviewFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{sub}</div>
    </div>
  );
}

/* ——— Publish success ——— */
function ProtoPublishSuccess({ tpl, copyLink, copied }) {
  const { nav, invite, toast } = useProto();
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center', animation: 'protoStepIn 300ms ease-out' }}>
        <div style={{ width: 400 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,12.5 10,17.5 19,7"/></svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 6 }}>Урилга нийтлэгдлээ!</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            «{invite.title}» одоо нийтэд нээлттэй. Линкээ зочдодоо илгээгээрэй.
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 14px',
            borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)', marginBottom: 16,
          }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-primary)', flex: 1, fontWeight: 500 }}>invites.mn/i/{invite.slug}</span>
            <span onClick={copyLink}>
              <DSButton variant={copied ? 'secondary' : 'primary'} size="sm">{copied ? 'Хуулагдсан ✓'.replace(' ✓', '') : 'Хуулах'}{copied && <CheckIcon/>}</DSButton>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <span onClick={() => toast('PNG татагдаж байна...', 'info')}><DSButton variant="secondary" size="sm">Зураг татах (PNG)</DSButton></span>
            <span onClick={() => toast('QR код татагдлаа', 'success')}><DSButton variant="secondary" size="sm">QR код татах</DSButton></span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span onClick={() => nav('guest')}><DSButton variant="accent">Урилгаа үзэх</DSButton></span>
            <span onClick={() => nav('dashboard')}><DSButton variant="ghost">Dashboard руу</DSButton></span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <DSQRPreview />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Хэвлэмэлд бэлэн QR</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProtoCreate, PInput, PTextarea, StepHead });
