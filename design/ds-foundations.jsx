/* invite — Design System: Foundations */

const fndS = {
  section: { marginBottom: 56 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 24, letterSpacing: '-0.01em' },
  subTitle: { fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 12 },
};

/* ——— Color Palette ——— */
const colorTokens = [
  { label: 'Background',        var: '--color-bg',               hex: '#F8F7F4' },
  { label: 'Surface',           var: '--color-surface',          hex: '#FFFFFF' },
  { label: 'Surface Elevated',  var: '--color-surface-elevated', hex: '#FFFFFF' },
  { label: 'Border',            var: '--color-border',           hex: '#E5E1DB' },
  { label: 'Border Muted',      var: '--color-border-muted',     hex: '#EEEAE5' },
  { label: 'Primary',           var: '--color-primary',          hex: '#2A2725' },
  { label: 'Primary Hover',     var: '--color-primary-hover',    hex: '#1A1816' },
  { label: 'Accent',            var: '--color-accent',           hex: '#8B5CF6' },
  { label: 'Accent Hover',      var: '--color-accent-hover',     hex: '#7C3AED' },
  { label: 'Accent Subtle',     var: '--color-accent-subtle',    hex: '#F3EEFE' },
  { label: 'Text Primary',      var: '--color-text-primary',     hex: '#1F1D1A' },
  { label: 'Text Secondary',    var: '--color-text-secondary',   hex: '#6D6762' },
  { label: 'Text Muted',        var: '--color-text-muted',       hex: '#9E9891' },
  { label: 'Success',           var: '--color-success',          hex: '#3B8A5A' },
  { label: 'Success BG',        var: '--color-success-bg',       hex: '#EFF8F2' },
  { label: 'Warning',           var: '--color-warning',          hex: '#C49234' },
  { label: 'Warning BG',        var: '--color-warning-bg',       hex: '#FDF8EE' },
  { label: 'Danger',            var: '--color-danger',           hex: '#C4443A' },
  { label: 'Danger BG',         var: '--color-danger-bg',        hex: '#FDF0EF' },
];

function ColorSwatch({ label, hex, cssVar }) {
  const isLight = ['#F8F7F4','#FFFFFF','#EEEAE5','#E5E1DB','#F3EEFE','#EFF8F2','#FDF8EE','#FDF0EF'].includes(hex);
  return (
    <div style={{ width: 120, flexShrink: 0 }}>
      <div style={{
        width: '100%', height: 64, borderRadius: 'var(--radius-sm)',
        backgroundColor: hex,
        border: isLight ? '1px solid var(--color-border)' : 'none',
        marginBottom: 8,
      }}></div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{hex}</div>
      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace', opacity: 0.7 }}>{cssVar}</div>
    </div>
  );
}

function ColorPalette() {
  return (
    <div style={fndS.section}>
      <div style={fndS.sectionTitle}>Color Tokens</div>
      <div style={fndS.subTitle}>Core Palette</div>
      <div style={{ ...fndS.grid, marginBottom: 24 }}>
        {colorTokens.slice(0, 5).map(c => <ColorSwatch key={c.var} label={c.label} hex={c.hex} cssVar={c.var} />)}
      </div>
      <div style={fndS.subTitle}>Brand</div>
      <div style={{ ...fndS.grid, marginBottom: 24 }}>
        {colorTokens.slice(5, 10).map(c => <ColorSwatch key={c.var} label={c.label} hex={c.hex} cssVar={c.var} />)}
      </div>
      <div style={fndS.subTitle}>Text</div>
      <div style={{ ...fndS.grid, marginBottom: 24 }}>
        {colorTokens.slice(10, 13).map(c => <ColorSwatch key={c.var} label={c.label} hex={c.hex} cssVar={c.var} />)}
      </div>
      <div style={fndS.subTitle}>Semantic</div>
      <div style={fndS.grid}>
        {colorTokens.slice(13).map(c => <ColorSwatch key={c.var} label={c.label} hex={c.hex} cssVar={c.var} />)}
      </div>
    </div>
  );
}

/* ——— Typography — 2 scale ——— */
const appScaleData = [
  { name: 'Page Title',    size: '32px', weight: 700, sample: 'Шинэ арга хэмжээ' },
  { name: 'Section Title', size: '24px', weight: 600, sample: 'Загвар сонгох' },
  { name: 'Section Title SM', size: '18px', weight: 600, sample: 'Дэлгэрэнгүй мэдээлэл' },
  { name: 'Card Title',    size: '14px', weight: 500, sample: 'Төрсөн өдрийн урилга' },
  { name: 'Body / Label',  size: '12px', weight: 400, lh: 1.5, sample: 'Та бүхнийг баярын ёслолд урьж байна. Хүрэлцэн ирнэ үү.' },
  { name: 'Label Medium',  size: '12px', weight: 500, sample: 'Огноо & цаг' },
  { name: 'Small / Caption', size: '11px', weight: 400, sample: 'Сүүлд засварлагдсан: 2026.06.10' },
];
const guestScaleData = [
  { name: 'Hero Title',    size: '48px', weight: 700, sample: 'Баярын урилга' },
  { name: 'Section Title', size: '24px', weight: 700, sample: 'Хэрхэн ажилладаг вэ?' },
  { name: 'Card / Action', size: '15px', weight: 500, sample: 'Ирэхээ мэдэгдэх' },
  { name: 'Body Large',    size: '15px', weight: 400, lh: 1.6, sample: 'Загвараа сонгоод, мэдээллээ оруулаад, линкээр хуваалцаарай.' },
  { name: 'Body',          size: '14px', weight: 400, lh: 1.55, sample: 'Та бүхнийг хүндэт зочноор урьж байна. Хүрэлцэн ирэхийг хүсье.' },
  { name: 'Caption',       size: '12px', weight: 400, sample: 'invites.mn дээр үүсгэв' },
];

function TypeRows({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {data.map((t, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '140px 90px 1fr',
          alignItems: 'baseline', padding: '12px 0',
          borderBottom: '1px solid var(--color-border-muted)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>{t.name}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{t.size}/{t.weight}{t.lh ? ` · ${t.lh}` : ''}</div>
          <div style={{ fontSize: t.size, fontWeight: t.weight, lineHeight: t.lh || 1.3, color: 'var(--color-text-primary)' }}>{t.sample}</div>
        </div>
      ))}
    </div>
  );
}

function TypeScale() {
  return (
    <div style={fndS.section}>
      <div style={fndS.sectionTitle}>Typography — 2 scale</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 20, maxWidth: 640, lineHeight: 1.6 }}>
        Font: Roboto · Нэг font, хоёр хэмжээс: <b>App/Admin</b> — нягт, 12px суурь (dashboard, create форм, admin, editor); <b>Guest/Marketing</b> — уншихад зориулсан 14–15px body, line-height 1.55–1.6 (landing, public invite). Кирилл body текстэнд letter-spacing tightening хэрэглэхгүй.
      </div>
      <div style={fndS.subTitle}>App / Admin scale — 12px base</div>
      <TypeRows data={appScaleData} />
      <div style={{ ...fndS.subTitle, marginTop: 28 }}>Guest / Marketing scale — 14–15px body</div>
      <TypeRows data={guestScaleData} />
    </div>
  );
}

/* ——— Spacing ——— */
const spacingData = [
  { name: 'sp-1',  val: 4 },  { name: 'sp-2',  val: 6 },
  { name: 'sp-3',  val: 8 },  { name: 'sp-4',  val: 12 },
  { name: 'sp-5',  val: 16 }, { name: 'sp-6',  val: 20 },
  { name: 'sp-7',  val: 24 }, { name: 'sp-8',  val: 32 },
  { name: 'sp-9',  val: 40 }, { name: 'sp-10', val: 56 },
  { name: 'sp-11', val: 72 },
];

function SpacingScale() {
  return (
    <div style={fndS.section}>
      <div style={fndS.sectionTitle}>Spacing Scale</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {spacingData.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace', textAlign: 'right' }}>{s.name}</div>
            <div style={{ width: 36, fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'right' }}>{s.val}px</div>
            <div style={{
              width: s.val * 3, height: 16,
              backgroundColor: 'var(--color-accent)',
              borderRadius: 3, opacity: 0.25 + (s.val / 100),
              transition: 'width var(--duration-normal) var(--ease-out)',
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— Border Radius ——— */
const radiusData = [
  { name: 'Small',  val: '8px',  token: '--radius-sm' },
  { name: 'Medium', val: '12px', token: '--radius-md' },
  { name: 'Large',  val: '20px', token: '--radius-lg' },
  { name: 'XL',     val: '28px', token: '--radius-xl' },
];

function RadiusScale() {
  return (
    <div style={fndS.section}>
      <div style={fndS.sectionTitle}>Border Radius</div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {radiusData.map(r => (
          <div key={r.name} style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: r.val,
              border: '2px solid var(--color-accent)',
              backgroundColor: 'var(--color-accent-subtle)',
              marginBottom: 8,
            }}></div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{r.name}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{r.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— Shadows ——— */
const shadowData = [
  { name: 'XS',  val: 'var(--shadow-xs)', raw: '0 1px 2px rgba(…,0.04)' },
  { name: 'SM',  val: 'var(--shadow-sm)', raw: '0 2px 8px rgba(…,0.05)' },
  { name: 'MD',  val: 'var(--shadow-md)', raw: '0 4px 16px rgba(…,0.07)' },
  { name: 'LG',  val: 'var(--shadow-lg)', raw: '0 8px 28px rgba(…,0.09)' },
  { name: 'XL',  val: 'var(--shadow-xl)', raw: '0 16px 48px rgba(…,0.12)' },
];

function ShadowScale() {
  return (
    <div style={fndS.section}>
      <div style={fndS.sectionTitle}>Shadows</div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {shadowData.map(s => (
          <div key={s.name} style={{ textAlign: 'center' }}>
            <div style={{
              width: 100, height: 72,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: s.val,
              marginBottom: 8,
            }}></div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace', maxWidth: 100 }}>{s.raw}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoundationsShowcase() {
  return (
    <div>
      <ColorPalette />
      <TypeScale />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <SpacingScale />
        <div>
          <RadiusScale />
          <ShadowScale />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FoundationsShowcase, ColorPalette, TypeScale, SpacingScale, RadiusScale, ShadowScale });
