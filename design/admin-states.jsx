/* invites — Admin: UX states sheet + component map */

function StateCard({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function AdminStates() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '28px 24px', alignItems: 'start' }}>

        <StateCard title="Save success toast">
          <DSToast variant="success" message="Загвар хадгалагдлаа" />
        </StateCard>

        <StateCard title="Background upload failure">
          <DSToast variant="danger" message="Файл оруулахад алдаа гарлаа — дахин оролдоно уу" />
        </StateCard>

        <StateCard title="Video processing (MP4)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-muted)', maxWidth: 320 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-accent)', animation: `dsLoadPulse 1.2s ease-in-out ${i*0.15}s infinite` }}></div>)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>Видео боловсруулж байна...</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>gerelt-udesh.mp4 · 64%</div>
            </div>
          </div>
        </StateCard>

        <StateCard title="Unsaved changes warning">
          <div style={{ width: 330, borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '18px 22px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Хадгалаагүй өөрчлөлт байна</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>Гарвал сүүлийн өөрчлөлтүүд устана. Хадгалах уу?</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: '1px solid var(--color-border-muted)', marginTop: 14 }}>
              <DSButton variant="ghost" size="sm">Хадгалахгүй гарах</DSButton>
              <DSButton variant="primary" size="sm">Хадгалах</DSButton>
            </div>
          </div>
        </StateCard>

        <StateCard title="Publish confirmation">
          <div style={{ width: 330, borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '18px 22px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Загвар нийтлэх үү?</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>«Алтан намар» бүх хэрэглэгчид харагдана. Дараа нь буцааж болно.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, padding: '8px 10px', borderRadius: 8, backgroundColor: 'var(--color-success-bg)' }}>
                <AIc d={adminIcons.check} size={12} />
                <span style={{ fontSize: 11, color: 'var(--color-success)' }}>Бүх шаардлагатай талбар тодорхойлогдсон</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: '1px solid var(--color-border-muted)', marginTop: 14 }}>
              <DSButton variant="ghost" size="sm">Болих</DSButton>
              <DSButton variant="accent" size="sm">Нийтлэх</DSButton>
            </div>
          </div>
        </StateCard>

        <StateCard title="Delete confirmation">
          <DSModal title="Загвар устгах уу?" description="«Шинэ гараа» болон түүний талбарын тохиргоо бүрмөсөн устана. 12 хэрэглэгчийн урилга энэ загварт холбоотой тул эхлээд тэдгээрийг шилжүүлэх шаардлагатай." />
        </StateCard>

        <StateCard title="Invalid template warning">
          <div style={{ maxWidth: 380, padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-bg)', border: '1px solid #EBD9A8' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: 'var(--color-warning)', display: 'inline-flex', flexShrink: 0, marginTop: 1 }}><AIc d={adminIcons.warn} size={15} /></span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Нийтлэх боломжгүй</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 8 }}>Дараах шаардлагатай зүйлс дутуу байна:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['event_date талбар нэмэгдээгүй', 'Thumbnail оруулаагүй'].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-warning)' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>{m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StateCard>

        <StateCard title="Loading state">
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)', maxWidth: 320 }}>
            <DSLoadingState />
          </div>
        </StateCard>

        <StateCard title="Error state">
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)', maxWidth: 320 }}>
            <DSErrorState message="Загваруудыг ачаалж чадсангүй. Сүлжээгээ шалгаад дахин оролдоно уу." />
          </div>
        </StateCard>

        <StateCard title="Empty state">
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)', maxWidth: 320 }}>
            <DSEmptyState title="Файл алга" description="Эхний фон файлаа оруулаарай" action="Файл оруулах" />
          </div>
        </StateCard>

      </div>
    </div>
  );
}

/* ——— Component map (handoff doc) ——— */
function ComponentMap() {
  const rows = [
    { page: '/admin', uses: 'AdminShell, AStat, DSButton, DSSectionHeader, DSStatusBadge, AThumb', notes: 'Quick action card — шинэ компонент (AQuickAction)' },
    { page: '/admin/templates', uses: 'AdminShell, ATable/ATd, ARowAction, DSSearchInput, DSSelect, DSBadge, DSStatusBadge, DSPagination, SkeletonCard, DSEmptyState, TypeBadge', notes: 'AViewToggle — шинэ (table/grid)' },
    { page: '/admin/templates/[id]/edit', uses: 'DSButton, DSInput, DSSelect, DSToggle, DSStatusBadge, DSTabs (mobile)', notes: 'Шинэ: EditorSettingsPanel, EditorCanvas, EditorFieldsPanel, ESegment, EMiniInput. TemplateLayerItem + FieldSettingsPanel энд амьдарна' },
    { page: '/admin/categories', uses: 'AdminShell, ATable, DSToggle, DSInput, DSButton, ARowAction', notes: 'Drag-handle мөр — ATable-ийн variant' },
    { page: '/admin/invites', uses: 'AdminShell, ATable, DSStatusBadge, DSSearchInput, DSSelect, DSPagination, AThumb', notes: 'Шинэ variant байхгүй' },
    { page: '/admin/assets', uses: 'AdminShell, DSSearchInput, DSSelect, ARowAction, DSToast', notes: 'AssetCard — шинэ; lock/in-use хамгаалалттай' },
    { page: '/admin/delivery-logs', uses: 'AdminShell, DeliveryLogTable, DSDeliveryBadge, DSBadge, DSSelect, DSDateInput, DSSearchInput, DSPagination', notes: 'Шинэ: DeliveryLogTable (failed мөр expand), DeliveryStatusBadge' },
    { page: '/invites/[id]/edit → Зочид', uses: 'GuestTable, GuestCard (mobile), GuestFormModal, SendInviteBar, DSDeliveryBadge, RSVPBadge, DSCheckbox, DSEmptyState', notes: 'Шинэ: GuestTable, GuestCard, GuestFormModal, SendInviteBar' },
    { page: '/i/[slug] · /g/[token]', uses: 'PublicInviteBody, RSVPSheet, GuestGreetingHeader, InvalidLinkState', notes: 'Шинэ: GuestGreetingHeader (хувийн урилга), InvalidLinkState (notfound/archived), SlugAvailabilityHint (create flow)' },
    { page: 'Email илгээлт', uses: 'EmailInviteTemplate', notes: 'Шинэ: email-safe, нэг багана, inline style — table суурьтай бүтээх' },
    { page: 'States (бүх хуудас)', uses: 'DSToast, DSModal, DSLoadingState, DSErrorState, DSEmptyState', notes: 'ConfirmModal variant: unsaved / publish / delete' },
  ];
  const shared = [
    ['AdminShell', 'Бүх admin хуудасны layout — dark sidebar + topbar. DashboardShell-ийн admin variant'],
    ['ATable / ATd / ARowAction', 'DataTable-ийн авсаархан admin хувилбар — бүх жагсаалтад'],
    ['FieldConfig (схем)', 'key, label, placeholder, required, x/y/w/h, font, color, align, maxChars, fit, radius, order, visible — JSON хэлбэрээр хадгалагдаж editor canvas + хэрэглэгчийн форм хоёуланг үүсгэнэ'],
    ['InviteCard', 'Хэрэглэгчийн preview, public хуудас, admin sample-data preview — гурвууланд нэг компонент'],
    ['DSDeliveryBadge / ArchivedBadge', 'Илгээлт (Илгээгээгүй/Илгээж байна/Илгээсэн/Амжилтгүй) ба Архивлагдсан төлөв — guest table, delivery log, dashboard гурвууланд'],
    ['GuestTable / GuestCard / GuestFormModal / SendInviteBar', 'Зочдын удирдлага — desktop table, mobile card, нэмэх/засах modal, bulk илгээлтийн bar'],
    ['RSVPSheet / GuestGreetingHeader', 'Зочны хариу форм (нэр + сонголт + хүний тоо + тайлбар) ба /g/[token] хувийн мэндчилгээ. /g/ үед нэр prefill'],
    ['InvalidLinkState / SlugAvailabilityHint / EmailInviteTemplate', 'Хүчингүй линк (notfound/archived), slug шалгалтын 4 төлөв, email урилгын загвар'],
  ];
  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-surface)', padding: 28 }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Component map — handoff</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>Хуудас бүрд ашиглагдах компонентууд ба шинээр шаардлагатай variant-ууд</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
        <thead>
          <tr>
            {['Хуудас', 'Ашиглагдах компонент', 'Шинэ / variant'].map((h, i) => (
              <th key={i} style={{ padding: '7px 10px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: '9px 10px', fontSize: 12, fontWeight: 600, borderBottom: '1px solid var(--color-border-muted)', whiteSpace: 'nowrap', fontFamily: 'monospace', verticalAlign: 'top' }}>{r.page}</td>
              <td style={{ padding: '9px 10px', fontSize: 11, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-muted)', lineHeight: 1.6 }}>{r.uses}</td>
              <td style={{ padding: '9px 10px', fontSize: 11, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border-muted)', lineHeight: 1.6 }}>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Дундын (shared) компонентууд</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {shared.map((s, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-bg)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', marginBottom: 4, color: 'var(--color-accent)' }}>{s[0]}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{s[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AdminStates, ComponentMap });
