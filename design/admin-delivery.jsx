/* invites — Admin: delivery logs (/admin/delivery-logs) */

const dlogRows = [
  { guest: 'О. Сүхбат', invite: 'Анужингийн төрсөн өдөр', art: 'birthday', provider: 'Email', status: 'sent', time: '2026.06.10 14:32', msgId: 'msg_8Kj2mQx9', err: '' },
  { guest: 'Г. Билгүүн', invite: 'Анужингийн төрсөн өдөр', art: 'birthday', provider: 'Email', status: 'sending', time: '2026.06.10 14:31', msgId: 'msg_3Lp8nRw2', err: '' },
  { guest: 'Ц. Сарангэрэл', invite: 'Б.Болд & М.Сараа хурим', art: 'wedding', provider: 'SMS', status: 'failed', time: '2026.06.10 13:05', msgId: 'msg_9Qw4tYu1', err: 'INVALID_NUMBER — утасны дугаар буруу форматтай (+976 эхлэх ёстой). Дугаарыг засаад дахин илгээнэ үү.' },
  { guest: 'Д. Номин-Эрдэнэ', invite: 'Q3 компанийн арга хэмжээ', art: 'corporate', provider: 'Email', status: 'sent', time: '2026.06.09 18:44', msgId: 'msg_2Xc7vBn5', err: '' },
  { guest: 'Б. Тэмүүлэн', invite: 'Б.Болд & М.Сараа хурим', art: 'wedding', provider: 'Email', status: 'failed', time: '2026.06.09 11:20', msgId: 'msg_6Mn1kJh8', err: 'BOUNCE — хүлээн авагчийн inbox дүүрсэн эсвэл хаяг идэвхгүй. 24 цагийн дараа автоматаар дахин оролдоно.' },
];

function AdminDeliveryLogs() {
  const thStyle = { padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.04em' };
  const tdStyle = { padding: '10px 12px', fontSize: 12, borderBottom: '1px solid var(--color-border-muted)', verticalAlign: 'middle' };
  return (
    <AdminShell active="Илгээлтийн лог" title="Илгээлтийн лог">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <DSSelect value="Бүх төлөв" options={['Бүх төлөв','Илгээсэн','Илгээж байна','Амжилтгүй','Илгээгээгүй']} />
          <DSDateInput value="2026.06.01 — 06.10" />
        </div>
        <div style={{ width: 240 }}><DSSearchInput placeholder="Зочин, message ID хайх..." /></div>
      </div>
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-muted)', backgroundColor: 'var(--color-surface)', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Зочин</th>
              <th style={thStyle}>Урилга</th>
              <th style={thStyle}>Provider</th>
              <th style={thStyle}>Төлөв</th>
              <th style={thStyle}>Илгээсэн цаг</th>
              <th style={thStyle}>Message ID</th>
            </tr>
          </thead>
          <tbody>
            {dlogRows.map((r, i) => (
              <React.Fragment key={i}>
                <tr style={{ backgroundColor: r.status === 'failed' ? 'var(--color-danger-bg)' : 'transparent', cursor: r.status === 'failed' ? 'pointer' : 'default' }}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{r.guest}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ position: 'relative', width: 26, height: 34, borderRadius: 4, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-muted)' }}>
                        <TplArt kind={r.art} scale={0.17} />
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180, display: 'inline-block' }}>{r.invite}</span>
                    </div>
                  </td>
                  <td style={tdStyle}><DSBadge>{r.provider}</DSBadge></td>
                  <td style={tdStyle}><DSDeliveryBadge status={r.status} /></td>
                  <td style={{ ...tdStyle, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{r.time}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted)' }}>{r.msgId}</td>
                </tr>
                {r.status === 'failed' && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0, borderBottom: '1px solid var(--color-border-muted)' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px 12px 14px', backgroundColor: 'var(--color-danger-bg)' }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--color-danger)" strokeWidth="1.4" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.7" fill="var(--color-danger)" stroke="none"/></svg>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: 'var(--color-danger)', fontWeight: 500, marginBottom: 2 }}>Алдааны дэлгэрэнгүй</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.55, fontFamily: 'monospace' }}>{r.err}</div>
                        </div>
                        <DSButton variant="secondary" size="sm">Дахин илгээх</DSButton>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>148-аас 1–5-г харуулж байна · 2 амжилтгүй</span>
        <DSPagination current={1} total={30} />
      </div>
      {/* states */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
          ['Loading', <DSLoadingState key="l" />],
          ['Empty', <DSEmptyState key="e" title="Илгээлт алга" description="Сонгосон шүүлтэд тохирох илгээлтийн бичлэг олдсонгүй" />],
          ['Error', <DSErrorState key="r" message="Лог татахад алдаа гарлаа. Дахин оролдоно уу." />],
        ].map(([label, comp], i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>{comp}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminDeliveryLogs });
