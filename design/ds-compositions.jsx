/* invite — Design System: Compositions (DataTable, Preview Frames, Layout Shells, Sample Compositions) */

const compS = {
  section: { marginBottom: 48 },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 20, letterSpacing: '-0.01em' },
  subTitle: { fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
};

/* ——— Data Table ——— */
const tableData = [
  { name: 'Хаврын төрсөн өдөр', type: 'Төрсөн өдөр', status: 'published', date: '2024.06.01', views: 142 },
  { name: 'Б.Болд & М.Сараа хурим', type: 'Хурим', status: 'active', date: '2024.05.28', views: 89 },
  { name: 'Q3 компани арга хэмжээ', type: 'Корпоратив', status: 'draft', date: '2024.06.10', views: 0 },
  { name: 'Мөнхийн 1 нас', type: 'Хүүхдийн баяр', status: 'expired', date: '2024.03.15', views: 234 },
];

function DSDataTable() {
  const thStyle = {
    padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)',
    textAlign: 'left', borderBottom: '1px solid var(--color-border)',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  };
  const tdStyle = {
    padding: '10px 12px', fontSize: 12, color: 'var(--color-text-primary)',
    borderBottom: '1px solid var(--color-border-muted)',
  };
  return (
    <div style={{
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Нэр</th>
            <th style={thStyle}>Төрөл</th>
            <th style={thStyle}>Төлөв</th>
            <th style={thStyle}>Огноо</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Үзэлт</th>
            <th style={{ ...thStyle, width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{row.name}</td>
              <td style={tdStyle}><DSBadge>{row.type}</DSBadge></td>
              <td style={tdStyle}><DSStatusBadge status={row.status} /></td>
              <td style={{ ...tdStyle, color: 'var(--color-text-secondary)' }}>{row.date}</td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--color-text-secondary)' }}>{row.views}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="4" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="8" cy="12" r="1"/></svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ——— Preview Frame ——— */
function DSPreviewFrame({ children, label = 'Preview' }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
        borderBottom: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF6B5E' }}></div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F5BD4F' }}></div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#61C554' }}></div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>{label}</span>
      </div>
      <div style={{ padding: 16, minHeight: 200 }}>
        {children || (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>desktop preview content</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ——— Phone Preview Frame ——— */
function DSPhonePreviewFrame({ children }) {
  return (
    <div style={{
      width: 220, borderRadius: 28, overflow: 'hidden',
      border: '8px solid var(--color-primary)',
      backgroundColor: 'var(--color-surface)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{
        height: 24, backgroundColor: 'var(--color-primary)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 4,
      }}>
        <div style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
      </div>
      <div style={{ height: 380, overflow: 'hidden', position: 'relative' }}>
        {children || (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(139,92,246,0.04) 12px, rgba(139,92,246,0.04) 13px)',
          }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>mobile preview</span>
          </div>
        )}
      </div>
      <div style={{
        height: 20, backgroundColor: 'var(--color-primary)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ width: 40, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
      </div>
    </div>
  );
}

/* ——— Sidebar (mini) ——— */
const SidebarIcon = ({ d }) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const sideNavItems = [
  { label: 'Хянах самбар', icon: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z', active: true },
  { label: 'Урилгууд', icon: 'M2 4h12M2 8h12M2 12h12' },
  { label: 'Загварууд', icon: 'M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zM2 6h12' },
  { label: 'Тохиргоо', icon: 'M8 10a2 2 0 100-4 2 2 0 000 4zM13 8a5 5 0 01-1.1 3.2M3.1 4.8A5 5 0 018 3' },
];

function DSSidebar() {
  return (
    <div style={{
      width: 200, height: 400, padding: '16px 0',
      backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border-muted)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>i</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>invites</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {sideNavItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            backgroundColor: item.active ? 'var(--color-bg)' : 'transparent',
            color: item.active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontSize: 12, fontWeight: item.active ? 500 : 400,
            transition: 'all var(--duration-fast)',
          }}>
            <SidebarIcon d={item.icon} />
            {item.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{
        margin: '0 12px', padding: 12, borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-accent-subtle)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-accent)', marginBottom: 4 }}>Pro болох</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Хязгааргүй загвар, видео экспорт</div>
      </div>
    </div>
  );
}

/* ——— Topbar ——— */
function DSTopbar() {
  return (
    <div style={{
      height: 48, padding: '0 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-muted)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>Хянах самбар</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.4" strokeLinecap="round"><path d="M14 6a5 5 0 00-10 0c0 5-2 6-2 6h14s-2-1-2-6"/><path d="M10.5 15a1.5 1.5 0 01-3 0"/></svg>
          <div style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-danger)', border: '1.5px solid var(--color-surface)' }}></div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          backgroundColor: 'var(--color-accent-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, color: 'var(--color-accent)',
        }}>Б</div>
      </div>
    </div>
  );
}

/* ——— Sample Composition 1: Template Gallery Section ——— */
function CompositionGallery() {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-muted)', padding: 24, maxWidth: 680,
    }}>
      <DSPageHeader title="Загвар сонгох" subtitle="Арга хэмжээний төрлөө сонгоод загвараа олоорой" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <DSCategoryChip label="Бүгд" active />
        <DSCategoryChip label="Төрсөн өдөр" />
        <DSCategoryChip label="Хурим" />
        <DSCategoryChip label="Корпоратив" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <DSSearchInput placeholder="Загвар хайх..." />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <DSTemplateCard name="Хаврын урилга" category="Төрсөн өдөр" />
        <DSTemplateCard name="Алтан намар" category="Хурим" premium />
        <DSTemplateCard name="Цэцэгс" category="Хүүхдийн баяр" selected />
      </div>
    </div>
  );
}

/* ——— Sample Composition 2: Event Detail Form Step ——— */
function CompositionEventForm() {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-muted)', padding: 24, maxWidth: 480,
    }}>
      <div style={{ marginBottom: 20 }}>
        <DSStepper steps={['Загвар', 'Мэдээлэл', 'Засварлах', 'Хуваалцах']} currentStep={1} />
      </div>
      <DSSectionHeader title="Арга хэмжээний мэдээлэл" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <DSInput label="Арга хэмжээний нэр" placeholder="Жнь: Болдын төрсөн өдөр" />
        <DSSelect label="Төрөл" value="Төрсөн өдөр" options={['Төрсөн өдөр','Хурим','Корпоратив']} />
        <DSDateInput label="Огноо" value="2024.06.15" />
        <DSTimeInput label="Цаг" value="18:00" />
      </div>
      <DSInput label="Байршил" placeholder="Хаяг оруулна уу" />
      <DSTextarea label="Нэмэлт тэмдэглэл" placeholder="Урилгад нэмэх текст..." rows={2} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <DSButton variant="ghost">Буцах</DSButton>
        <DSButton variant="primary">Үргэлжлүүлэх<ChevronIcon/></DSButton>
      </div>
    </div>
  );
}

/* ——— Sample Composition 3: Dashboard Shell ——— */
function CompositionDashboard() {
  return (
    <div style={{
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      border: '1px solid var(--color-border-muted)',
      display: 'flex', height: 400,
    }}>
      <DSSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DSTopbar />
        <div style={{ flex: 1, padding: 20, backgroundColor: 'var(--color-bg)', overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Нийт урилга', value: '48', sub: '+6 энэ сард' },
              { label: 'Нийт үзэлт', value: '1,247', sub: '+23% өмнөх сараас' },
              { label: 'Идэвхтэй', value: '12', sub: '3 нийтлэгдсэн' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: 14, borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-muted)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-success)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <DSSectionHeader title="Сүүлийн урилгууд" action={<DSButton variant="ghost" size="sm">Бүгдийг харах</DSButton>} />
          <DSDataTable />
        </div>
      </div>
    </div>
  );
}

function CompositionsShowcase() {
  return (
    <div>
      <div style={compS.section}>
        <div style={compS.title}>Data Table</div>
        <DSDataTable />
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Нийт 4 бичлэг</span>
          <DSPagination current={1} total={3} />
        </div>
      </div>

      <div style={compS.section}>
        <div style={compS.title}>Preview Frames</div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}><DSPreviewFrame label="invites.mn/e/x8kJ2mQ" /></div>
          <DSPhonePreviewFrame />
        </div>
      </div>

      <div style={compS.section}>
        <div style={compS.title}>Layout: Sidebar + Topbar</div>
        <CompositionDashboard />
      </div>

      <div style={compS.section}>
        <div style={compS.title}>Composition: Template Gallery</div>
        <CompositionGallery />
      </div>

      <div style={compS.section}>
        <div style={compS.title}>Composition: Event Detail Form</div>
        <CompositionEventForm />
      </div>
    </div>
  );
}

Object.assign(window, {
  DSDataTable, DSPreviewFrame, DSPhonePreviewFrame, DSSidebar, DSTopbar,
  CompositionGallery, CompositionEventForm, CompositionDashboard, CompositionsShowcase,
});
