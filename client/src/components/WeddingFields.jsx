import DateTimeField from './DateTimeField'

/*
 * Wedding-only fields, shown inside «Нэмэлт сонголтууд» when the chosen
 * template uses the wedding layout. Everything is optional — the guest
 * page simply drops whatever is left blank.
 */
export const emptyWeddingFields = {
  weddingGroom: '', weddingBride: '',
  weddingGroomParents: '', weddingBrideParents: '',
  weddingCeremonyAt: '', weddingCeremonyVenue: '',
  weddingDressCode: '',
}

export default function WeddingFields({ extras, patch }) {
  return (
    <>
      <label>Хосын нэр
        <div className="wed-pair">
          <input lang="mn" value={extras.weddingGroom} onChange={(event) => patch({ weddingGroom: event.target.value })} placeholder="Хүргэний нэр" maxLength={40} />
          <input lang="mn" value={extras.weddingBride} onChange={(event) => patch({ weddingBride: event.target.value })} placeholder="Бэрийн нэр" maxLength={40} />
        </div>
        <span className="kfield-hint">Хоёр нэр урилгын толгойд том харагдана. Хоосон бол арга хэмжээний нэр гарна.</span>
      </label>

      <label>Эцэг эхийн нэр
        <div className="wed-pair">
          <input lang="mn" value={extras.weddingGroomParents} onChange={(event) => patch({ weddingGroomParents: event.target.value })} placeholder="Хүргэний эцэг эх" maxLength={80} />
          <input lang="mn" value={extras.weddingBrideParents} onChange={(event) => patch({ weddingBrideParents: event.target.value })} placeholder="Бэрийн эцэг эх" maxLength={80} />
        </div>
        <span className="kfield-hint">Жишээ: Дорж, Оюунчимэг</span>
      </label>

      <label>Ёслолын ажиллагааны цаг
        <DateTimeField value={extras.weddingCeremonyAt} onChange={(next) => patch({ weddingCeremonyAt: next })} />
        <span className="kfield-hint">Ёслол найраасаа тусад нь болдог бол энд оруулна. Хоосон бол зөвхөн найрын цаг харагдана.</span>
      </label>

      <label>Ёслол болох газар
        <input lang="mn" value={extras.weddingCeremonyVenue} onChange={(event) => patch({ weddingCeremonyVenue: event.target.value })} placeholder="Жишээ: Гэрлэх ёслолын ордон" maxLength={160} />
      </label>

      <label>Хувцаслалт
        <input lang="mn" value={extras.weddingDressCode} onChange={(event) => patch({ weddingDressCode: event.target.value })} placeholder="Жишээ: Гоёлын хувцас — зөөлөн өнгө" maxLength={120} />
      </label>
    </>
  )
}
