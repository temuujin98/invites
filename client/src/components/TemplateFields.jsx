import DateTimeField from './DateTimeField'

/*
 * The extra fields a template asks for, driven by its own `fields` list.
 * Nothing here is keyed on event type — a template declares what it needs
 * and this renders exactly that, in the order declared.
 */

function Pair({ extras, patch, a, b, placeholderA, placeholderB }) {
  return (
    <div className="tf-pair">
      <input lang="mn" value={extras[a]} onChange={(event) => patch({ [a]: event.target.value })} placeholder={placeholderA} maxLength={80} />
      <input lang="mn" value={extras[b]} onChange={(event) => patch({ [b]: event.target.value })} placeholder={placeholderB} maxLength={80} />
    </div>
  )
}

function Single({ extras, patch, name, placeholder, max = 120 }) {
  return (
    <input lang="mn" value={extras[name]} onChange={(event) => patch({ [name]: event.target.value })} placeholder={placeholder} maxLength={max} />
  )
}

/* key → label + what to render. Add a group here and any template can use it. */
export const fieldGroups = {
  couple: {
    label: 'Хосын нэр',
    hint: 'Хоёр нэр урилгын толгойд том харагдана. Хоосон бол арга хэмжээний нэр гарна.',
    render: (props) => <Pair {...props} a="groom" b="bride" placeholderA="Хүргэний нэр" placeholderB="Бэрийн нэр" />,
  },
  /* two sides of a marriage — not the same thing as one child's parents */
  parents: {
    label: 'Хоёр талын эцэг эх',
    hint: 'Жишээ: Дорж, Оюунчимэг',
    render: (props) => <Pair {...props} a="groomParents" b="brideParents" placeholderA="Хүргэний талаас" placeholderB="Бэрийн талаас" />,
  },
  family: {
    label: 'Эцэг эх',
    hint: 'Хүүхдийн баярт — аав, ээжийн нэр.',
    render: (props) => <Pair {...props} a="father" b="mother" placeholderA="Аавын нэр" placeholderB="Ээжийн нэр" />,
  },
  ceremony: {
    label: 'Ёслолын ажиллагаа',
    hint: 'Ёслол найраасаа тусад нь болдог бол оруулна. Хоосон бол зөвхөн үндсэн цаг харагдана.',
    render: ({ extras, patch }) => (
      <>
        <DateTimeField value={extras.ceremonyAt} onChange={(next) => patch({ ceremonyAt: next })} />
        <input lang="mn" value={extras.ceremonyVenue} onChange={(event) => patch({ ceremonyVenue: event.target.value })} placeholder="Ёслол болох газар" maxLength={160} />
      </>
    ),
  },
  dressCode: {
    label: 'Хувцаслалт',
    render: (props) => <Single {...props} name="dressCode" placeholder="Жишээ: Гоёлын хувцас — зөөлөн өнгө" />,
  },
  age: {
    label: 'Нас / ой',
    hint: 'Урилга дээр том тоогоор харагдана. Жишээ: 27, эсвэл «10 жил».',
    render: (props) => <Single {...props} name="age" placeholder="Жишээ: 27" max={20} />,
  },
  honoree: {
    label: 'Хүндэтгэх хүн',
    hint: 'Төгсөгч, хүүхэд, ойн эзэн — хэний нэрээр болж буй вэ.',
    render: (props) => <Single {...props} name="honoree" placeholder="Нэр" max={80} />,
  },
  host: {
    label: 'Зохион байгуулагч',
    hint: 'Байгууллага эсвэл хүлээн авагч талын нэр.',
    render: (props) => <Single {...props} name="host" placeholder="Жишээ: Invites.mn ХХК" max={120} />,
  },
}

export default function TemplateFields({ fields = [], extras, patch }) {
  return fields.map((key) => {
    const group = fieldGroups[key]
    if (!group) return null
    return (
      <label key={key}>{group.label}
        {group.render({ extras, patch })}
        {group.hint && <span className="kfield-hint">{group.hint}</span>}
      </label>
    )
  })
}
