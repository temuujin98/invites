import { templates, formatPrice } from '../templates'
import { FunnelHeader, InvitePreview } from '../components/Shared'

export default function CreateGallery() {
  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="ЗАГВАР СОНГОХ" />
      <header className="funnel-head">
        <h1>Загвараа<br />сонгоорой</h1>
        <p className="funnel-lead">Загвар дээр дараад мэдээллээ оруулна. Загвар бүр өөрийн үнэтэй.</p>
      </header>
      <section className="tpl-grid" aria-label="Урилгын загварууд">
        {templates.map((template) => (
          <div className="tpl-item" key={template.id}>
            <a href={`/create/${template.id}`} aria-label={`${template.name} сонгох`}>
              <InvitePreview
                tone={template.tone}
                eventType={template.eventType}
                title={template.sample.title}
                dateText={template.sample.date}
                bgId={template.id}
              />
            </a>
            <div className="tpl-meta">
              <div>
                <b>{template.name}</b>
                <small>{template.eventType}</small>
              </div>
              <span className="tpl-price">{formatPrice(template.price)}</span>
            </div>
            <div className="tpl-actions">
              <a className="klink" href={`/demo/${template.id}`} target="_blank" rel="noreferrer">Жишээ үзэх ↗</a>
              <a className="kbutton kbutton-small" href={`/create/${template.id}`}>Сонгох →</a>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
