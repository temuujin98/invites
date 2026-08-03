import { useRef, useState } from 'react'
import { uploadCover } from '../lib/uploadCover'
import { INTRO_PRICE, formatPrice, banks, curtainColors } from '../templates'
import WeddingFields, { emptyWeddingFields } from './WeddingFields'

/*
 * "Нэмэлт сонголтууд" fieldset shared by the create and edit forms.
 * value: { gallery: [urls], mapUrl, program: [{time, activity}], note,
 *          phone, bankName, bankNumber, bankHolder, intro, introColor,
 *          musicUrl, musicStart, musicEnd } plus the wedding-only fields
 *          when `wedding` is set.
 * Everything is optional — empty options simply don't render on the guest page.
 */
export const emptyExtras = {
  gallery: [], mapUrl: '', program: [], note: '', phone: '',
  bankName: '', bankNumber: '', bankHolder: '',
  intro: '', introColor: 'violet',
  musicUrl: '', musicStart: '', musicEnd: '',
  ...emptyWeddingFields,
}

export default function ExtraOptions({ value, onChange, showIntro = true, wedding = false }) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)
  const extras = { ...emptyExtras, ...value }

  function patch(part) {
    onChange({ ...extras, ...part })
  }

  async function pickImages(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setUploading(true)
    setUploadError('')
    const urls = [...extras.gallery]
    for (const file of files) {
      if (urls.length >= 8) break
      const result = await uploadCover(file)
      if (result.error) { setUploadError('Зарим зургийг оруулж чадсангүй. Дахин оролдоно уу.'); continue }
      urls.push(result.url)
    }
    setUploading(false)
    patch({ gallery: urls })
    if (fileRef.current) fileRef.current.value = ''
  }

  function setProgramRow(index, part) {
    const program = extras.program.map((row, rowIndex) => rowIndex === index ? { ...row, ...part } : row)
    patch({ program })
  }

  return (
    <div className="extras">
      <button type="button" className="extras-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? '− Нэмэлт сонголтууд' : '+ Нэмэлт сонголтууд'}
        <span className="extras-hint">{wedding ? 'хосын нэр · эцэг эх · ёслол · цомог · дуу…' : 'зургийн цомог · хөтөлбөр · дуу · данс…'}</span>
      </button>
      {open && (
        <div className="extras-body">

          {wedding && <WeddingFields extras={extras} patch={patch} />}

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
                <button
                  type="button"
                  className={`intro-choice ${extras.intro === 'envelope' ? 'selected' : ''}`}
                  onClick={() => patch({ intro: 'envelope' })}
                >✉️ Захидал нээгдэх</button>
              </div>
              {extras.intro === 'curtain' && (
                <div className="curtain-colors">
                  {curtainColors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      className={`curtain-swatch cs-${color.id} ${extras.introColor === color.id ? 'selected' : ''}`}
                      onClick={() => patch({ introColor: color.id })}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                  <span className="kfield-hint">Хөшигний өнгө</span>
                </div>
              )}
              <span className="kfield-hint">Зочин урилгыг нээхэд тайзны хөшиг сүр жавхлантай нээгдэж урилга ил гарна</span>
            </label>
          )}

          <label>Зургийн цомог ({extras.gallery.length}/8)
            {extras.gallery.length > 0 && (
              <div className="gallery-thumbs">
                {extras.gallery.map((url, index) => (
                  <span className="gallery-thumb" key={url}>
                    <img src={url} alt={`Зураг ${index + 1}`} />
                    <button type="button" aria-label="Устгах" onClick={() => patch({ gallery: extras.gallery.filter((_, i) => i !== index) })}>×</button>
                  </span>
                ))}
              </div>
            )}
            {extras.gallery.length < 8 && (
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={pickImages} disabled={uploading} />
            )}
            {uploading && <span className="kfield-hint">Зураг илгээж байна…</span>}
            {uploadError && <span className="kerror">{uploadError}</span>}
            <span className="kfield-hint">Урилга дээр зургийн цомог хэлбэрээр харагдана</span>
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

          <label>Дуу (YouTube линк)
            <input type="url" value={extras.musicUrl} onChange={(event) => patch({ musicUrl: event.target.value })} placeholder="https://youtu.be/..." />
            <span className="kfield-hint">Урилга нээгдэхэд дуу тоглоно (зочин унтраах боломжтой)</span>
          </label>
          {extras.musicUrl && (
            <div className="music-range">
              <label>Эхлэх цэг
                <input value={extras.musicStart} onChange={(event) => patch({ musicStart: event.target.value })} placeholder="0:30" maxLength={8} />
              </label>
              <label>Дуусах цэг
                <input value={extras.musicEnd} onChange={(event) => patch({ musicEnd: event.target.value })} placeholder="1:30" maxLength={8} />
              </label>
              <span className="kfield-hint music-range-hint">Сонгосон хэсгийг давтаж тоглуулна (хамгийн багадаа 10 сек). Хоосон бол эхнээс нь бүтнээр давтана.</span>
            </div>
          )}

          <label>Тусгай тэмдэглэл
            <textarea maxLength={300} value={extras.note} onChange={(event) => patch({ note: event.target.value })} placeholder="Жишээ: Dress code — гоёлын хувцас. Хүүхдийн өрөө тусдаа байгаа." />
          </label>

          <label>Холбоо барих утас
            <input value={extras.phone} onChange={(event) => patch({ phone: event.target.value })} placeholder="9911xxxx" maxLength={40} />
          </label>

          <label>Данс
            <div className="bank-fields">
              <select className="kdate-select bank-select" value={extras.bankName} onChange={(event) => patch({ bankName: event.target.value })}>
                <option value="" disabled>Банк сонгох</option>
                {banks.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
              </select>
              <input value={extras.bankNumber} onChange={(event) => patch({ bankNumber: event.target.value })} placeholder="Дансны дугаар" maxLength={30} />
              <input value={extras.bankHolder} onChange={(event) => patch({ bankHolder: event.target.value })} placeholder="Эзэмшигчийн нэр" maxLength={60} />
            </div>
            <span className="kfield-hint">Бэлэг хүргэх дансаа оруулбал урилгад харагдана</span>
          </label>

        </div>
      )}
    </div>
  )
}
