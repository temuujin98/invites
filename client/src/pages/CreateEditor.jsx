import { useState } from 'react'
import { getTemplate, formatPrice, saveDraft, loadDraft } from '../templates'
import { FunnelHeader, InvitePreview } from '../components/Shared'

export default function CreateEditor({ templateId }) {
  const template = getTemplate(templateId)
  const existing = loadDraft()
  const initial = existing?.templateId === templateId ? existing.values : {}
  const [title, setTitle] = useState(initial.title || '')
  const [eventAt, setEventAt] = useState(initial.eventAt || '')
  const [venue, setVenue] = useState(initial.venue || '')
  const [message, setMessage] = useState(initial.message || '')

  if (!template) {
    return (
      <main className="kpage funnel-page">
        <FunnelHeader />
        <header className="funnel-head"><h1>Загвар олдсонгүй</h1><p className="funnel-lead"><a className="klink" href="/create">Загваруудын жагсаалт руу буцах</a></p></header>
      </main>
    )
  }

  function continueToVerify(event) {
    event.preventDefault()
    saveDraft({ templateId, values: { title: title.trim(), eventAt, venue: venue.trim(), message: message.trim() }, savedAt: Date.now() })
    window.location.href = '/create/confirm'
  }

  const previewDate = eventAt
    ? new Intl.DateTimeFormat('mn-MN', { dateStyle: 'medium' }).format(new Date(eventAt))
    : template.sample.date

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="2/4 · МЭДЭЭЛЛЭЭ ОРУУЛАХ" />
      <header className="funnel-head">
        <h1>{template.name} · {template.eventType}</h1>
        <p className="funnel-lead">{template.description} Үнэ: <b>{formatPrice(template.price)}</b></p>
      </header>
      <section className="editor-grid">
        <form className="kform" onSubmit={continueToVerify}>
          <label>Арга хэмжээний нэр
            <input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Жишээ: Тэмүүлэн × Номин" />
          </label>
          <label>Огноо ба цаг
            <input type="datetime-local" required value={eventAt} onChange={(event) => setEventAt(event.target.value)} />
          </label>
          <label>Байршил
            <input required maxLength={160} value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="Жишээ: Улаанбаатар · Тансаг өргөө" />
          </label>
          <label>Урилгын мессеж
            <textarea maxLength={400} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Таныг бидний онцгой өдөрт урьж байна" />
          </label>
          <div className="kform-actions">
            <a className="klink" href="/create">← Өөр загвар</a>
            <button className="kbutton" type="submit">Үргэлжлүүлэх →</button>
          </div>
        </form>
        <div className="editor-preview-panel">
          <p>ШУУД ХАРАГДАЦ</p>
          <InvitePreview
            tone={template.tone}
            eventType={template.eventType}
            title={title || template.sample.title}
            dateText={venue ? `${previewDate} · ${venue}` : previewDate}
            big
          />
        </div>
      </section>
    </main>
  )
}
