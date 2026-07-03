/* invites — Pages: Public invite (guest view) + Auth pages */

/* ——— Guest action button ——— */
function GuestAction({ icon, label, primary }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      width: '100%', padding: '12px 0', borderRadius: 12,
      border: primary ? 'none' : '1px solid var(--color-border)',
      backgroundColor: primary ? 'var(--color-primary)' : 'var(--color-surface)',
      color: primary ? '#fff' : 'var(--color-text-primary)',
      fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-family)', cursor: 'pointer',
    }}>{icon}{label}</button>
  );
}

const giIcons = {
  rsvp: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4.5h12v8H2z"/><path d="M2 5l6 4 6-4"/></svg>,
  map: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14.5s5-4.2 5-7.8A5 5 0 003 6.7c0 3.6 5 7.8 5 7.8z"/><circle cx="8" cy="6.8" r="1.8"/></svg>,
  cal: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="6.5" x2="14" y2="6.5"/><line x1="5.5" y1="1.5" x2="5.5" y2="4.5"/><line x1="10.5" y1="1.5" x2="10.5" y2="4.5"/></svg>,
  share: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="3.5" r="1.8"/><circle cx="4" cy="8" r="1.8"/><circle cx="12" cy="12.5" r="1.8"/><line x1="5.6" y1="7.1" x2="10.4" y2="4.4"/><line x1="5.6" y1="8.9" x2="10.4" y2="11.6"/></svg>,
};

/* ——— Public invite body (shared mobile/desktop) ——— */
function PublicInviteBody({ width = '100%' }) {
  return (
    <div style={{ width, backgroundColor: '#FDFCFA', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-lg)' }}>
      {/* hero photo area */}
      <div style={{
        height: 200, background: stripeBg(45, 0.08), backgroundColor: 'var(--color-bg)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative',
      }}>
        <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 9, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>загварын cover зураг</span>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', marginBottom: -48,
          background: stripeBg(120, 0.1), backgroundColor: 'var(--color-surface)',
          border: '3px solid #FDFCFA', boxShadow: 'var(--shadow-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>зураг</span>
        </div>
      </div>
      <div style={{ padding: '60px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.32em', color: 'var(--color-accent)', fontWeight: 500, marginBottom: 12 }}>ТАНЫГ УРЬЖ БАЙНА</div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 6 }}>Анужингийн төрсөн өдөр</div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>Бат-Эрдэнэ гэр бүлээс урьж байна</div>

        {/* date/time/location block */}
        <div style={{
          borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)',
          backgroundColor: 'var(--color-surface)', padding: 16, marginBottom: 16, textAlign: 'left',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {[
            { icon: giIcons.cal, label: 'Огноо', value: '2026 оны 6-р сарын 21, Ням' },
            { icon: giIcons.rsvp && <ClockIcon/>, label: 'Цаг', value: '18:00 — 22:00' },
            { icon: giIcons.map, label: 'Байршил', value: 'Shangri-La Ulaanbaatar', sub: 'Олимпийн гудамж 19А, 3 давхар' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{r.value}</div>
                {r.sub && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{r.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20, padding: '0 8px' }}>
          Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирж, баярын баяр хөөрийг бидэнтэй хуваалцана уу.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <GuestAction icon={giIcons.rsvp} label="Ирэхээ мэдэгдэх" primary />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <GuestAction icon={giIcons.map} label="Газрын зураг" />
            <GuestAction icon={giIcons.cal} label="Календарт нэмэх" />
          </div>
          <GuestAction icon={giIcons.share} label="Хуваалцах" />
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, paddingTop: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 7, fontWeight: 700 }}>i</span>
          </div>
          invites.mn дээр үүсгэв
        </div>
      </div>
    </div>
  );
}

function PublicInviteMobile() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#F1EEE9', padding: '20px 14px 28px', minHeight: 760 }}>
      <PublicInviteBody />
    </div>
  );
}

function PublicInviteDesktop() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: '#F1EEE9', minHeight: 800, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{ width: 440 }}>
        <PublicInviteBody />
      </div>
    </div>
  );
}

/* ——— Auth pages ——— */
function AuthCard({ title, sub, children, footer }) {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', padding: '48px 0', display: 'flex', justifyContent: 'center', minHeight: 560 }}>
      <div style={{ width: 340 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}><PLogo size={32} textSize={18} /></div>
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-muted)', boxShadow: 'var(--shadow-sm)', padding: 28,
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4, textAlign: 'center' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20, textAlign: 'center' }}>{sub}</div>
          {children}
        </div>
        {footer && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 16 }}>{footer}</div>}
      </div>
    </div>
  );
}

function AuthLogin() {
  return (
    <AuthCard title="Тавтай морил" sub="Бүртгэлдээ нэвтэрнэ үү" footer={<span>Бүртгэлгүй юу? <span style={{ color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer' }}>Бүртгүүлэх</span></span>}>
      <DSInput label="И-мэйл" placeholder="tanii@mail.mn" />
      <DSInput label="Нууц үг" value="••••••••" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <DSCheckbox label="Намайг сана" checked />
        <span style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer' }}>Нууц үг мартсан?</span>
      </div>
      <DSButton variant="primary" size="lg" style={{ width: '100%', marginBottom: 12 }}>Нэвтрэх</DSButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border-muted)' }}></div>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>эсвэл</span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border-muted)' }}></div>
      </div>
      <DSButton variant="secondary" size="lg" style={{ width: '100%' }}>Google-ээр нэвтрэх</DSButton>
    </AuthCard>
  );
}

function AuthRegister() {
  return (
    <AuthCard title="Бүртгүүлэх" sub="Үнэгүй бүртгэл үүсгээд эхлээрэй" footer={<span>Бүртгэлтэй юу? <span style={{ color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer' }}>Нэвтрэх</span></span>}>
      <DSInput label="Нэр" placeholder="Таны нэр" />
      <DSInput label="И-мэйл" value="bat@mail" error="И-мэйл хаяг буруу байна" />
      <DSInput label="Нууц үг" placeholder="8+ тэмдэгт" helper="Үсэг, тоо хосолсон байх ёстой" />
      <DSButton variant="primary" size="lg" style={{ width: '100%', margin: '8px 0 12px' }}>Бүртгүүлэх</DSButton>
      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
        Бүртгүүлснээр та <span style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>үйлчилгээний нөхцөл</span>-ийг зөвшөөрч байна
      </div>
    </AuthCard>
  );
}

function AuthForgot() {
  return (
    <AuthCard title="Нууц үг сэргээх" sub="И-мэйл хаягаа оруулбал сэргээх линк илгээнэ" footer={<span style={{ color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer' }}>← Нэвтрэх рүү буцах</span>}>
      <DSInput label="И-мэйл" placeholder="tanii@mail.mn" />
      <DSButton variant="primary" size="lg" style={{ width: '100%', marginTop: 8 }}>Линк илгээх</DSButton>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 12px',
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-bg)',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="5.5"/><polyline points="4.5,7 6.5,9 9.5,5.5"/></svg>
        <span style={{ fontSize: 11, color: 'var(--color-success)' }}>Линк илгээгдлээ — и-мэйлээ шалгана уу</span>
      </div>
    </AuthCard>
  );
}

Object.assign(window, { PublicInviteMobile, PublicInviteDesktop, AuthLogin, AuthRegister, AuthForgot, PublicInviteBody });
