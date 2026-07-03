/* invites — Pages: Landing (desktop + mobile) */

const lpMax = { maxWidth: 1080, margin: '0 auto', padding: '0 48px' };
const lpSecTitle = { fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 8, textAlign: 'center' };
const lpSecSub = { fontSize: 14, lineHeight: 1.55, color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 36 };

/* Hero invitation composition: phone preview + floating chips */
function HeroComposition() {
  return (
    <div style={{ position: 'relative', width: 360, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DSPhonePreviewFrame>
          <div style={{ height: '100%', overflow: 'hidden', backgroundColor: '#FDFCFA' }}>
            <InviteCard scale={0.92} frame={false} />
          </div>
        </DSPhonePreviewFrame>
      </div>
      {/* floating UI chips */}
      <div style={{
        position: 'absolute', top: 48, left: -36, padding: '8px 12px',
        backgroundColor: 'var(--color-surface)', borderRadius: 10, boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border-muted)', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: stripeBg(45, 0.12), backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}></div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Загвар</div>
          <div style={{ fontSize: 11, fontWeight: 500 }}>Цэцэгс №12</div>
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 150, right: -48, padding: '8px 12px',
        backgroundColor: 'var(--color-surface)', borderRadius: 10, boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border-muted)',
      }}>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>Хуваалцах линк</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-accent)' }}>invites.mn/i/anujin</div>
      </div>
      <div style={{
        position: 'absolute', bottom: 64, left: -28, padding: '8px 12px',
        backgroundColor: 'var(--color-surface)', borderRadius: 10, boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border-muted)', display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
        <span style={{ fontSize: 11, fontWeight: 500 }}>24 зочин ирэхээ мэдэгдсэн</span>
      </div>
    </div>
  );
}

function HowItWorks({ mobile }) {
  const steps = [
    { n: '1', t: 'Загвар сонгоно', d: 'Баярын төрөлдөө тохирох загвараа сонгоорой' },
    { n: '2', t: 'Мэдээллээ оруулна', d: 'Нэр, огноо, байршлаа бөглөхөд урилга бэлэн' },
    { n: '3', t: 'Линкээр хуваалцана', d: 'Зочдодоо линк илгээгээд хариуг нь хүлээн аваарай' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? 20 : 32 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12, flexShrink: 0,
            backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
          }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryRow({ mobile }) {
  const cats = [
    { type: 'birthday', label: 'Төрсөн өдөр', count: 24 },
    { type: 'wedding', label: 'Хурим', count: 18 },
    { type: 'corporate', label: 'Корпоратив', count: 12 },
    { type: 'opening', label: 'Төгсөлт', count: 9 },
    { type: 'birthday', label: 'Хүүхэд угтах', count: 7 },
    { type: 'opening', label: 'Нээлт', count: 8 },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
      {cats.map((c, i) => <DSEventTypeCard key={i} type={c.type} label={c.label} count={c.count} active={i === 0} />)}
    </div>
  );
}

function FeatureGrid({ mobile }) {
  const feats = [
    { t: 'Мэргэжлийн загварууд', d: 'Дизайнерууд Canva дээр бүтээсэн чанартай загварууд тогтмол нэмэгдэнэ' },
    { t: 'Шууд урьдчилан харах', d: 'Мэдээлэл оруулах бүрд урилга тань шууд шинэчлэгдэнэ' },
    { t: 'Зураг оруулах', d: 'Өөрийн зургаа байршуулж, хүрээнд тааруулан засаарай' },
    { t: 'Нийтийн линк', d: 'Урилга бүр өөрийн гэсэн товч, ойлгомжтой линктэй' },
    { t: 'QR код', d: 'Хэвлэмэл материалд тавихад бэлэн QR код автоматаар үүснэ' },
    { t: 'Зураг ба видео', d: 'Урилгаа зураг эсвэл видео хэлбэрээр татаж аваарай' },
  ];
  const FIcon = ({ i }) => {
    const paths = [
      'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
      'M12 5c-5 0-8.5 4.5-9.5 7 1 2.5 4.5 7 9.5 7s8.5-4.5 9.5-7c-1-2.5-4.5-7-9.5-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
      'M4 16l5-5 3 3 4-4 4 4M4 20h16M4 4h16v12H4z',
      'M9 15l-4.5-1.5a2.5 2.5 0 010-4.7L18 4l-4.8 13.5a2.5 2.5 0 01-4.7 0L9 15z',
      'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
      'M5 5h10v14H5zM15 9l4-2.5v11L15 15',
    ];
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[i]}/></svg>;
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
      {feats.map((f, i) => (
        <div key={i} style={{
          padding: 20, borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
        }}>
          <div style={{ marginBottom: 12 }}><FIcon i={i} /></div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{f.t}</div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{f.d}</div>
        </div>
      ))}
    </div>
  );
}

function UseCases({ mobile }) {
  const cases = [
    { who: 'Гэр бүлд', text: 'Төрсөн өдөр, ой, угтах ёслол — дотны хүмүүстээ дулаан урилга илгээгээрэй.', name: 'Б. Номин', role: 'Хүүхдийн 1 насны ой' },
    { who: 'Хосуудад', text: 'Хуримын урилгаа хэдхэн минутад бэлдээд, зочдын хариуг нэг дороос хараарай.', name: 'Т. Билгүүн', role: 'Хуримын урилга' },
    { who: 'Байгууллагад', text: 'Нээлт, хүлээн авалт, дотоод арга хэмжээ — брэндийн өнгө аястай урилга.', name: 'MCS Group', role: 'Корпоратив эвент' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
      {cases.map((c, i) => (
        <div key={i} style={{
          padding: 24, borderRadius: 'var(--radius-lg)',
          backgroundColor: i === 1 ? 'var(--color-primary)' : 'var(--color-surface)',
          border: '1px solid var(--color-border-muted)',
          color: i === 1 ? '#fff' : 'var(--color-text-primary)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 1 ? 'rgba(255,255,255,0.6)' : 'var(--color-accent)', marginBottom: 10 }}>{c.who}</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, color: i === 1 ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)' }}>{c.text}</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontSize: 11, color: i === 1 ? 'rgba(255,255,255,0.55)' : 'var(--color-text-muted)' }}>{c.role}</div>
        </div>
      ))}
    </div>
  );
}

function PricingTeaser({ mobile }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-sm)',
      padding: mobile ? '32px 24px' : '40px 56px', textAlign: 'center',
    }}>
      <div style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 8 }}>Үнэгүй эхлээрэй</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>
        Бүртгэл үүсгээд анхны урилгаа үнэгүй хийгээрэй. Илүү олон загвар, видео экспорт хэрэгтэй бол Pro руу ахиулаарай.
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <DSButton variant="accent" size="lg">Урилга үүсгэх</DSButton>
        <DSButton variant="ghost" size="lg">Үнийн мэдээлэл</DSButton>
      </div>
    </div>
  );
}

/* ——— Landing: Desktop ——— */
function LandingDesktop() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <PublicHeader />
      {/* Hero */}
      <div style={{ ...lpMax, display: 'flex', alignItems: 'center', gap: 64, padding: '64px 48px 72px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', fontSize: 11, fontWeight: 500, marginBottom: 20 }}>
            Монголын анхны дижитал урилгын платформ
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.12, margin: '0 0 16px' }}>
            Баярын урилгаа<br/>минутын дотор
          </h1>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 420 }}>
            Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай. Дизайнер шаардлагагүй — ердөө гурван алхам.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <DSButton variant="accent" size="lg">Урилга үүсгэх</DSButton>
            <DSButton variant="secondary" size="lg" style={{ whiteSpace: 'nowrap' }}>Загварууд үзэх</DSButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {['Н','Б','С','Д'].map((l, i) => (
                <div key={i} style={{
                  width: 24, height: 24, borderRadius: '50%', marginLeft: i ? -7 : 0,
                  backgroundColor: ['#E8E1F8','#F3EEFE','#DED2F5','#EFE9FB'][i],
                  border: '1.5px solid var(--color-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 600, color: 'var(--color-accent)',
                }}>{l}</div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>2,400+ урилга үүсгэгдсэн</span>
          </div>
        </div>
        <HeroComposition />
      </div>

      {/* How it works */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', borderBottom: '1px solid var(--color-border-muted)', padding: '56px 0' }}>
        <div style={lpMax}>
          <div style={lpSecTitle}>Хэрхэн ажилладаг вэ?</div>
          <div style={lpSecSub}>Гурван энгийн алхам — урилга тань бэлэн</div>
          <HowItWorks />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '56px 0' }}>
        <div style={lpMax}>
          <div style={lpSecTitle}>Ямар ч баярт тохирно</div>
          <div style={lpSecSub}>Төрөл бүрийн арга хэмжээнд зориулсан загварууд</div>
          <CategoryRow />
        </div>
      </div>

      {/* Featured templates */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', borderBottom: '1px solid var(--color-border-muted)', padding: '56px 0' }}>
        <div style={lpMax}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <div style={{ ...lpSecTitle, textAlign: 'left', marginBottom: 4 }}>Онцлох загварууд</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Хамгийн их ашиглагдаж буй загварууд</div>
            </div>
            <DSButton variant="ghost">Бүгдийг үзэх<ChevronIcon/></DSButton>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <PTemplateCard name="Цэцэгс" category="Төрсөн өдөр" deg={45} />
            <PTemplateCard name="Алтан намар" category="Хурим" premium deg={120} />
            <PTemplateCard name="Гэрэлт үдэш" category="Корпоратив" type="video" deg={75} />
            <PTemplateCard name="Багачууд" category="Хүүхэд угтах" deg={160} />
            <PTemplateCard name="Шинэ гараа" category="Нээлт" premium type="video" deg={30} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '56px 0' }}>
        <div style={lpMax}>
          <div style={lpSecTitle}>Хэрэгтэй бүхэн нэг дор</div>
          <div style={lpSecSub}>Урилга үүсгэхээс эхлээд зочдын хариу хүлээж авах хүртэл</div>
          <FeatureGrid />
        </div>
      </div>

      {/* Use cases */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', borderBottom: '1px solid var(--color-border-muted)', padding: '56px 0' }}>
        <div style={lpMax}>
          <div style={lpSecTitle}>Хэн ашигладаг вэ?</div>
          <div style={lpSecSub}>Гэр бүлээс байгууллага хүртэл</div>
          <UseCases />
        </div>
      </div>

      {/* Pricing teaser */}
      <div style={{ padding: '56px 0 72px' }}>
        <div style={lpMax}><PricingTeaser /></div>
      </div>

      <PublicFooter />
    </div>
  );
}

/* ——— Landing: Mobile ——— */
function LandingMobile() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-family)' }}>
      <MobileHeader />
      <div style={{ padding: '40px 20px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', fontSize: 11, fontWeight: 500, marginBottom: 16 }}>
          Дижитал урилгын платформ
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 12px' }}>Баярын урилгаа минутын дотор</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 24px' }}>
          Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
          <DSButton variant="accent" size="lg" style={{ width: '100%' }}>Урилга үүсгэх</DSButton>
          <DSButton variant="secondary" size="lg" style={{ width: '100%' }}>Загварууд үзэх</DSButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DSPhonePreviewFrame>
            <div style={{ height: '100%', overflow: 'hidden', backgroundColor: '#FDFCFA' }}>
              <InviteCard scale={0.92} frame={false} />
            </div>
          </DSPhonePreviewFrame>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', padding: '40px 20px' }}>
        <div style={{ ...lpSecTitle, fontSize: 20 }}>Хэрхэн ажилладаг вэ?</div>
        <div style={{ ...lpSecSub, marginBottom: 24 }}>Гурван энгийн алхам</div>
        <HowItWorks mobile />
      </div>

      <div style={{ padding: '40px 20px' }}>
        <div style={{ ...lpSecTitle, fontSize: 20 }}>Онцлох загварууд</div>
        <div style={{ ...lpSecSub, marginBottom: 24 }}>Хамгийн их ашиглагддаг</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PTemplateCard name="Цэцэгс" category="Төрсөн өдөр" w="auto" thumbH={190} deg={45} />
          <PTemplateCard name="Алтан намар" category="Хурим" premium w="auto" thumbH={190} deg={120} />
          <PTemplateCard name="Гэрэлт үдэш" category="Корпоратив" type="video" w="auto" thumbH={190} deg={75} />
          <PTemplateCard name="Багачууд" category="Хүүхэд угтах" w="auto" thumbH={190} deg={160} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <DSButton variant="secondary">Бүгдийг үзэх</DSButton>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-muted)', padding: '40px 20px' }}>
        <div style={{ ...lpSecTitle, fontSize: 20 }}>Хэрэгтэй бүхэн нэг дор</div>
        <div style={{ ...lpSecSub, marginBottom: 24 }}>Урилгаас хариу хүртэл</div>
        <FeatureGrid mobile />
      </div>

      <div style={{ padding: '40px 20px' }}>
        <PricingTeaser mobile />
      </div>

      <PublicFooter compact />
    </div>
  );
}

Object.assign(window, { LandingDesktop, LandingMobile });
