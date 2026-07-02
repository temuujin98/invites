/* invite — Design System: Controls (Buttons + Form Elements) */

const ctrlS = {
  section: { marginBottom: 48 },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 20, letterSpacing: '-0.01em' },
  subTitle: { fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  row: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  label: { fontSize: 11, color: 'var(--color-text-muted)', width: 72, flexShrink: 0 },
};

/* ——— Button ——— */
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
  borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
  padding: '8px 16px', lineHeight: 1,
  transition: 'all var(--duration-normal) var(--ease-out)',
};

const btnVariants = {
  primary:   { ...btnBase, backgroundColor: 'var(--color-primary)', color: '#fff' },
  secondary: { ...btnBase, backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' },
  ghost:     { ...btnBase, backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid transparent' },
  danger:    { ...btnBase, backgroundColor: 'var(--color-danger)', color: '#fff' },
  accent:    { ...btnBase, backgroundColor: 'var(--color-accent)', color: '#fff' },
};

const btnHover = {
  primary:   { backgroundColor: 'var(--color-primary-hover)' },
  secondary: { backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-text-muted)' },
  ghost:     { backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' },
  danger:    { backgroundColor: '#A93A32' },
  accent:    { backgroundColor: 'var(--color-accent-hover)' },
};

const btnDisabled = { opacity: 0.4, cursor: 'not-allowed' };

function DSButton({ variant = 'primary', children, disabled, hover, active, icon, size = 'md', style: sx }) {
  const s = { ...btnVariants[variant] };
  if (size === 'sm') { s.padding = '6px 12px'; s.fontSize = 11; }
  if (size === 'lg') { s.padding = '10px 20px'; s.fontSize = 14; }
  if (size === 'icon') { s.padding = 8; s.width = 32; s.height = 32; }
  if (hover) Object.assign(s, btnHover[variant]);
  if (active) { Object.assign(s, btnHover[variant]); s.transform = 'scale(0.97)'; }
  if (disabled) Object.assign(s, btnDisabled);
  return <button style={{ ...s, ...sx }} disabled={disabled}>{icon}{children}</button>;
}

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="7" y1="3" x2="7" y2="11"/><line x1="3" y1="7" x2="11" y2="7"/></svg>;
const ChevronIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3L7.5 6L4.5 9"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4"/><line x1="9" y1="9" x2="12" y2="12"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="1.5" y="2.5" width="11" height="10" rx="2"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5"/><line x1="4.5" y1="1" x2="4.5" y2="4"/><line x1="9.5" y1="1" x2="9.5" y2="4"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><polyline points="7,4 7,7 9.5,8.5"/></svg>;
const UploadIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13V3"/><path d="M6 7l4-4 4 4"/><path d="M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2"/></svg>;
const CheckIcon = () => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4.5,7.5 8,3"/></svg>;

function ButtonShowcase() {
  const variants = ['primary','secondary','ghost','danger','accent'];
  const labels = ['Primary','Secondary','Ghost','Danger','Accent'];
  return (
    <div style={ctrlS.section}>
      <div style={ctrlS.title}>Buttons</div>
      {variants.map((v, i) => (
        <div key={v} style={ctrlS.row}>
          <div style={ctrlS.label}>{labels[i]}</div>
          <DSButton variant={v}>Үүсгэх</DSButton>
          <DSButton variant={v} hover>Hover</DSButton>
          <DSButton variant={v} active>Active</DSButton>
          <DSButton variant={v} disabled>Disabled</DSButton>
        </div>
      ))}
      <div style={{ ...ctrlS.subTitle, marginTop: 20 }}>Sizes & Icon Buttons</div>
      <div style={ctrlS.row}>
        <DSButton variant="primary" size="sm">Жижиг</DSButton>
        <DSButton variant="primary">Дунд</DSButton>
        <DSButton variant="primary" size="lg">Том</DSButton>
        <DSButton variant="primary" icon={<PlusIcon/>}>Нэмэх</DSButton>
        <DSButton variant="secondary" size="icon" icon={<PlusIcon/>}/>
        <DSButton variant="ghost" size="icon" icon={<ChevronIcon/>}/>
      </div>
    </div>
  );
}

/* ——— Input ——— */
const inputBase = {
  width: '100%', maxWidth: 280, padding: '8px 12px',
  fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)', outline: 'none',
  transition: 'border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
};

function DSInput({ label, placeholder, value, helper, error, disabled, focused, icon }) {
  const s = { ...inputBase };
  if (focused) { s.borderColor = 'var(--color-accent)'; s.boxShadow = '0 0 0 3px var(--color-accent-subtle)'; }
  if (error) { s.borderColor = 'var(--color-danger)'; s.boxShadow = '0 0 0 3px var(--color-danger-bg)'; }
  if (disabled) { s.opacity = 0.5; s.backgroundColor = 'var(--color-bg)'; s.cursor = 'not-allowed'; }
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>{icon}</div>}
        <input style={{ ...s, ...(icon ? { paddingLeft: 32 } : {}) }} placeholder={placeholder} value={value} disabled={disabled} readOnly />
      </div>
      {helper && !error && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{helper}</div>}
      {error && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

/* ——— Textarea ——— */
function DSTextarea({ label, placeholder, value, error, rows = 3 }) {
  const s = { ...inputBase, maxWidth: 280, resize: 'vertical', minHeight: rows * 20 + 16 };
  if (error) { s.borderColor = 'var(--color-danger)'; s.boxShadow = '0 0 0 3px var(--color-danger-bg)'; }
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      <textarea style={s} placeholder={placeholder} value={value} readOnly />
      {error && <div style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

/* ——— Select ——— */
function DSSelect({ label, value, options = [], disabled }) {
  const s = { ...inputBase, appearance: 'none', paddingRight: 32 };
  if (disabled) { s.opacity = 0.5; s.cursor = 'not-allowed'; }
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      <div style={{ position: 'relative', maxWidth: 280 }}>
        <select style={s} disabled={disabled} value={value} readOnly>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: 'var(--color-text-muted)', pointerEvents: 'none', display: 'flex' }}><ChevronIcon/></div>
      </div>
    </div>
  );
}

/* ——— Search Input ——— */
function DSSearchInput({ placeholder = 'Хайх...', value }) {
  return <DSInput placeholder={placeholder} value={value} icon={<SearchIcon/>} />;
}

/* ——— Date & Time Inputs ——— */
function DSDateInput({ label, value }) {
  return <DSInput label={label} value={value} placeholder="2024.06.15" icon={<CalendarIcon/>} />;
}
function DSTimeInput({ label, value }) {
  return <DSInput label={label} value={value} placeholder="18:00" icon={<ClockIcon/>} />;
}

/* ——— File Upload ——— */
function DSFileUpload({ label }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{label}</div>}
      <div style={{
        maxWidth: 280, padding: '24px 16px', textAlign: 'center',
        border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-bg)', cursor: 'pointer',
        transition: 'border-color var(--duration-normal) var(--ease-out)',
      }}>
        <div style={{ color: 'var(--color-accent)', marginBottom: 6, display: 'flex', justifyContent: 'center' }}><UploadIcon/></div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Файл чирж оруулна уу</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>PNG, JPG · 5MB хүртэл</div>
      </div>
    </div>
  );
}

/* ——— Checkbox & Toggle ——— */
function DSCheckbox({ label, checked }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-surface)',
        border: checked ? 'none' : '1.5px solid var(--color-border)',
        color: '#fff', transition: 'all var(--duration-fast)',
      }}>{checked && <CheckIcon/>}</div>
      <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{label}</span>
    </div>
  );
}

function DSToggle({ label, on }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
      <div style={{
        width: 32, height: 18, borderRadius: 9, padding: 2,
        backgroundColor: on ? 'var(--color-accent)' : 'var(--color-border)',
        transition: 'background-color var(--duration-normal) var(--ease-out)',
        display: 'flex', alignItems: on ? 'center' : 'center', justifyContent: on ? 'flex-end' : 'flex-start',
      }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', boxShadow: 'var(--shadow-xs)', transition: 'all var(--duration-normal) var(--ease-out)' }}></div>
      </div>
      <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{label}</span>
    </div>
  );
}

function InputShowcase() {
  return (
    <div style={ctrlS.section}>
      <div style={ctrlS.title}>Form Controls</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <div>
          <div style={ctrlS.subTitle}>Text Input</div>
          <DSInput label="Нэр" placeholder="Нэрээ оруулна уу" />
          <DSInput label="Нэр (focused)" placeholder="Нэрээ оруулна уу" focused />
          <DSInput label="И-мэйл" value="test@" error="И-мэйл буруу байна" />
          <DSInput label="Утас" placeholder="..." disabled helper="Идэвхгүй" />
        </div>
        <div>
          <div style={ctrlS.subTitle}>Select & Date/Time</div>
          <DSSelect label="Арга хэмжээний төрөл" value="Төрсөн өдөр" options={['Төрсөн өдөр','Хурим','Корпоратив','Нээлтийн ажиллагаа']} />
          <DSDateInput label="Огноо" value="2024.06.15" />
          <DSTimeInput label="Цаг" value="18:00" />
          <DSSearchInput value="" />
        </div>
        <div>
          <div style={ctrlS.subTitle}>Textarea & Upload</div>
          <DSTextarea label="Нэмэлт тэмдэглэл" placeholder="Та нэмэлт мэдээлэл бичнэ үү..." rows={3} />
          <DSFileUpload label="Зураг оруулах" />
          <div style={ctrlS.subTitle}>Toggles</div>
          <DSCheckbox label="Нийтэд харуулах" checked />
          <DSCheckbox label="QR код оруулах" />
          <DSToggle label="Нийтлэх" on />
          <DSToggle label="Нууцлалтай" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DSButton, ButtonShowcase, DSInput, DSTextarea, DSSelect, DSSearchInput,
  DSDateInput, DSTimeInput, DSFileUpload, DSCheckbox, DSToggle, InputShowcase,
  PlusIcon, ChevronIcon, SearchIcon, CalendarIcon, ClockIcon, UploadIcon, CheckIcon,
});
