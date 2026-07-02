/* invites — Admin: dashboard + user invites management */

/* ——— Admin Dashboard ——— */
function AdminDashboard() {
  const quick = [
    { icon: adminIcons.plus, label: 'Загвар үүсгэх', sub: 'Шинэ загвар, талбар тодорхойлох', primary: true },
    { icon: adminIcons.upload, label: 'Фон файл оруулах', sub: 'Canva-аас экспортолсон PNG/MP4' },
    { icon: adminIcons.categories, label: 'Ангилал удирдах', sub: 'Нэр, эрэмбэ, икон' },
  ];
  const recentTemplates = [
    { name: 'Алтан намар', cat: 'Хурим', type: 'image', status: 'published', date: 'Өнөөдөр', deg: 120 },
    { name: 'Гэрэлт үдэш', cat: 'Корпоратив', type: 'video', status: 'draft', date: 'Өчигдөр', deg: 75 },
    { name: 'Багачууд', cat: 'Хүүхэд угтах', type: 'image', status: 'published', date: '06.07', deg: 160 },
  ];
  const recentInvites = [
    { user: 'bat@mail.mn', title: 'Анужингийн төрсөн өдөр', status: 'published', date: 'Өнөөдөр' },
    { user: 'saraa@mail.mn', title: 'Б.Болд & М.Сараа хурим', status: 'published', date: 'Өчигдөр' },
    { user: 'mcs@mcs.mn', title: 'Q3 компанийн арга хэмжээ', status: 'draft', date: '06.08' },
  ];
  return (
    <AdminShell active="Хянах самбар" title="Хянах самбар" actions={<DSButton variant="accent" size="sm" icon={<PlusIcon/>}>Загвар үүсгэх</DSButton>}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <AStat label="Нийт загвар" value="78" sub="+4 энэ сард" />
        <AStat label="Нийтлэгдсэн" value="64" />
        <AStat label="Ноорог" value="14" />
        <AStat label="Хэрэглэгчийн урилга" value="2,418" sub="+186 энэ долоо хоногт" accent />
      </div>
      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {quick.map((q, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            backgroundColor: q.primary ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
            border: q.primary ? '1px solid #DBC9F9' : '1px solid var(--color-border-muted)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              backgroundColor: q.primary ? 'var(--color-accent)' : 'var(--color-bg)',
              color: q.primary ? '#fff' : 'var(--color-text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><AIc d={q.icon} size={15} /></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{q.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{q.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Two columns: recent templates + recent invites */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <DSSectionHeader title="Сүүлийн загварууд" action={<DSButton variant="ghost" size="sm">Бүгд</DSButton>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentTemplates.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-muted)',
              }}>
                <AThumb deg={t.deg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{t.cat} · {t.type === 'video' ? 'Видео' : 'Зураг'}</div>
                </div>
                <DSStatusBadge status={t.status} />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 56, textAlign: 'right' }}>{t.date}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <DSSectionHeader title="Сүүлийн урилгууд" action={<DSButton variant="ghost" size="sm">Бүгд</DSButton>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentInvites.map((inv, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-muted)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{inv.user}</div>
                </div>
                <DSStatusBadge status={inv.status} />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 56, textAlign: 'right' }}>{inv.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ——— User invites management ——— */
function AdminInvites() {
  const rows = [
    { user: 'bat@mail.mn', tpl: 'Цэцэгс', deg: 45, title: 'Анужингийн төрсөн өдөр', status: 'published', date: '2026.06.09', link: 'invites.mn/i/anujin-6nas' },
    { user: 'saraa@mail.mn', tpl: 'Алтан намар', deg: 120, title: 'Б.Болд & М.Сараа хурим', status: 'published', date: '2026.06.07', link: 'invites.mn/i/bold-saraa' },
    { user: 'mcs@mcs.mn', tpl: 'Гэрэлт үдэш', deg: 75, title: 'Q3 компанийн арга хэмжээ', status: 'draft', date: '2026.06.08', link: '—' },
    { user: 'nomin@mail.mn', tpl: 'Багачууд', deg: 160, title: 'Мөнхийн 1 нас', status: 'expired', date: '2026.03.15', link: 'invites.mn/i/munkh-1nas' },
  ];
  return (
    <AdminShell active="Урилгууд" title="Хэрэглэгчийн урилгууд" actions={
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Нийт 2,418 урилга</span>
    }>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 240 }}><DSSearchInput placeholder="Хэрэглэгч, нэрээр хайх..." /></div>
        <DSSelect value="Бүх төлөв" options={['Бүх төлөв','Нийтлэгдсэн','Ноорог','Хугацаа дууссан']} />
        <DSSelect value="Бүх загвар" options={['Бүх загвар','Цэцэгс','Алтан намар']} />
      </div>
      <ATable head={[
        { label: 'Хэрэглэгч', w: 150 }, { label: 'Загвар', w: 130 }, { label: 'Арга хэмжээ' },
        { label: 'Төлөв', w: 110 }, { label: 'Огноо', w: 90 }, { label: 'Линк', w: 160 }, { label: '', w: 70, right: true },
      ]}>
        {rows.map((r, i) => (
          <tr key={i}>
            <ATd muted>{r.user}</ATd>
            <ATd>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AThumb deg={r.deg} w={26} h={34} r={4} />
                <span style={{ fontSize: 12 }}>{r.tpl}</span>
              </div>
            </ATd>
            <ATd style={{ fontWeight: 500 }}>{r.title}</ATd>
            <ATd><DSStatusBadge status={r.status} /></ATd>
            <ATd muted>{r.date}</ATd>
            <ATd>
              {r.link === '—' ? <span style={{ color: 'var(--color-text-muted)' }}>—</span> : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-accent)', cursor: 'pointer' }}>
                  <AIc d={adminIcons.link} size={11} />{r.link}
                </span>
              )}
            </ATd>
            <ATd right>
              <div style={{ display: 'inline-flex', gap: 5 }}>
                <ARowAction icon={adminIcons.eye} title="Урьдчилан үзэх" />
                <ARowAction icon={adminIcons.trash} danger title="Устгах" />
              </div>
            </ATd>
          </tr>
        ))}
      </ATable>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>2,418-аас 1–4-г харуулж байна</span>
        <DSPagination current={1} total={8} />
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminDashboard, AdminInvites });
