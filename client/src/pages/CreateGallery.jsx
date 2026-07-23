import { templates, formatPrice } from '../templates'
import { FunnelHeader, InvitePreview } from '../components/Shared'

export default function CreateGallery() {
  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="1/4 · ЗАГВАР СОНГОХ" />
      <header className="funnel-head">
        <h1>Загвараа<br />сонгоорой</h1>
        <p className="funnel-lead">Загвар дээр дараад мэдээллээ оруулна. Загвар бүр өөрийн үнэтэй.</p>
      </header>
      <section className="tpl-grid" aria-label="Урилгын загварууд">
        {templates.map((template) => (
          <a className="tpl-item" href={`/create/${template.id}`} key={template.id}>
            <InvitePreview
              tone={template.tone}
              eventType={template.eventType}
              title={template.sample.title}
              dateText={template.sample.date}
            />
            <div className="tpl-meta">
              <div>
                <b>{template.name}</b>
                <small>{template.eventType}</small>
              </div>
              <span className="tpl-price">{formatPrice(template.price)}</span>
            </div>
          </a>
        ))}
      </section>
    </main>
  )
}
