import { useRef, useState } from 'react'
import { uploadCover } from '../lib/uploadCover'
import { INTRO_PRICE, formatPrice } from '../templates'

/*
 * "Нэмэлт сонголтууд" fieldset shared by the create and edit forms.
 * value: { coverUrl, mapUrl, program: [{time, activity}], note, phone, bank }
 * Everything is optional — empty options simply don't render on the guest page.
 */
export const emptyExtras = { coverUrl: '', mapUrl: '', program: [], note: '', phone: '', bank: '', intro: '' }

export default function ExtraOptions({ value, onChange, showIntro = true }) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)
  const extras = { ...emptyExtras, ...value }

  function patch(part) {
    onChange({ ...extras, ...part })
  }

  async function pickCover(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const result = await uploadCover(file)
    setUploading(false)
    if (result.error) { setUploadError('Зураг оруулахад алдаа гарлаа. Дахин оролдоно уу.'); return }
    patch({ coverUrl: result.url })
  }

  function setProgramRow(index, part) {
    const program = extras.program.map((row, rowIndex) => rowIndex === index ? { ...row, ...part } : row)
    patch({ program })
  }

  return (
    <div className="extras">
      <button type="button" className="extras-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? '− Нэмэлт сонголтууд' : '+ Нэмэлт сонголтууд'}
        <span className="extras-hint">зураг · газрын зураг · хөтөлбөр · данс…</span>
      </button>
      {open && (
        <div className="extras-body">

          {showIntro && (
            <label>Нээлтийн эффект <span className="intro-price">+{formatPrice(INTRO_PRICE)}</span>
              <div className="intro-choices">
                <button
                  type="button"
                  className={`intro-choice ${!extras.intro ? 'selected' : ''}`}
                  onClick={() => patch({ intro: '' })}
                >Байхгүй</button>
                <button
                  type="button"
                  className={`intro-choice ${extras.intro === 'curtain' ? 'selected' : ''}`}
                  onClick={() => patch({ intro: 'curtain' })}
                >🎭 Хөшиг нээгдэх</button>
              </div>
              <span className="kfield-hint">Зочин урилгыг нээхэд тайзны хөшиг сүр жавхлантай нээгдэж урилга ил гарна</span>
            </label>
          )}

          <label>Ковер зураг
            {extras.coverUrl ? (
              <span className="cover-preview">
                <img src={extras.coverUrl} alt="Ковер зураг" />
                <button type="button" className="klink klink-button" onClick={() => { patch({ coverUrl: '' }); if (fileRef.current) fileRef.current.value = '' }}>Устгах</button>
              </span>
            ) : (
              <input ref={fileRef} type="file" accept="image/*" onChange={pickCover} disabled={uploading} />
            )}
            {uploading && <span className="kfield-hint">Зураг илгээж байна…</span>}
            {uploadError && <span className="kerror">{uploadError}</span>}
          </label>

          <label>Газрын зургийн линк
            <input type="url" value={extras.mapUrl} onChange={(event) => patch({ mapUrl: event.target.value })} placeholder="https://maps.google.com/..." />
            <span className="kfield-hint">Хоосон орхивол байршлын нэрээр Google Maps хайлт нээгдэнэ</span>
          </label>

          <label>Хөтөлбөр</label>
          <div className="program-rows">
            {extras.program.map((row, index) => (
              <div className="program-row" key={index}>
                <input className="program-time" value={row.time} onChange={(event) => setProgramRow(index, { time: event.target.value })} placeholder="16:00" maxLength={20} />
                <input className="program-activity" value={row.activity} onChange={(event) => setProgramRow(index, { activity: event.target.value })} placeholder="Зочид хүлээн авах" maxLength={120} />
                <button type="button" aria-label="Мөр устгах" onClick={() => patch({ program: extras.program.filter((_, rowIndex) => rowIndex !== index) })}>×</button>
              </div>
            ))}
            {extras.program.length < 12 && (
              <button type="button" className="klink klink-button" onClick={() => patch({ program: [...extras.program, { time: '', activity: '' }] })}>+ Мөр нэмэх</button>
            )}
          </div>

          <label>Тусгай тэмдэглэл
            <textarea maxLength={300} value={extras.note} onChange={(event) => patch({ note: event.target.value })} placeholder="Жишээ: Dress code — гоёлын хувцас. Хүүхдийн өрөө тусдаа байгаа." />
          </label>

          <label>Холбоо барих утас
            <input value={extras.phone} onChange={(event) => patch({ phone: event.target.value })} placeholder="9911xxxx" maxLength={40} />
          </label>

          <label>Хишгийн данс
            <input value={extras.bank} onChange={(event) => patch({ bank: event.target.value })} placeholder="Хаан банк · 5041xxxxxx · Тэмүүлэн" maxLength={120} />
            <span className="kfield-hint">Бэлэг хүргэх дансаа оруулбал урилгад харагдана</span>
          </label>

        </div>
      )}
    </div>
  )
}
