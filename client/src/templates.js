/* Invitation templates: the design lives in code, the price with the template. */

export const templates = [
  {
    id: 'lavender-wedding',
    layout: 'classic',
    name: 'Лаванда',
    eventType: 'Хурим',
    tone: 'lavender',
    price: 49000,
    description: 'Зөөлөн ягаан шилжилттэй, хоёр нэрийг том гаргадаг сонгодог хуримын загвар.',
    sample: { title: 'Тэмүүлэн × Номин', date: '2026.09.18' },
  },
  {
    id: 'rose-wedding',
    layout: 'romance',
    name: 'Сарнай',
    eventType: 'Хурим',
    tone: 'rose',
    price: 49000,
    description: 'Дулаан ягаан өнгийн романтик хуримын загвар.',
    sample: { title: 'Сүрэн × Бат', date: '2026.08.09' },
  },
  {
    id: 'coral-birthday',
    layout: 'party',
    name: 'Корал',
    eventType: 'Төрсөн өдөр',
    tone: 'coral',
    price: 29000,
    description: 'Өнгөлөг, залуу — үдэшлэг, төрсөн өдөрт төгс.',
    sample: { title: 'LUNAR 27', date: 'SAT 21:00' },
  },
  {
    id: 'sage-ceremony',
    layout: 'minimal',
    name: 'Ногоон',
    eventType: 'Ёслол',
    tone: 'sage',
    price: 39000,
    description: 'Хүндэтгэлийн ёслол, ойн баярт зориулсан тайван загвар.',
    sample: { title: 'Амараа × Номин', date: 'Улаанбаатар' },
  },
  {
    id: 'gold-reception',
    layout: 'luxe',
    name: 'Алт',
    eventType: 'Хүлээн авалт',
    tone: 'gold',
    price: 59000,
    description: 'Гала, нээлт, албан хүлээн авалтад зориулсан тансаг загвар.',
    sample: { title: 'GALA NIGHT', date: 'FRI 19:30' },
  },
  {
    id: 'ocean-graduation',
    layout: 'modern',
    name: 'Далай',
    eventType: 'Төгсөлт',
    tone: 'ocean',
    price: 29000,
    description: 'Төгсөлт, амжилтын баярт зориулсан цэнхэр загвар.',
    sample: { title: 'GRAD 26', date: 'UB · JUNE' },
  },
  {
    id: 'midnight-anniversary',
    layout: 'luxe',
    name: 'Шөнө',
    eventType: 'Ойн баяр',
    tone: 'midnight',
    price: 39000,
    description: 'Гүн хөх шөнийн өнгөтэй, ойн баярт зориулсан ёслол төгөлдөр загвар.',
    sample: { title: 'Мишээл × Тэмүүжин', date: '10 жилийн ой' },
  },
  {
    id: 'noir-party',
    layout: 'party',
    name: 'Нуар',
    eventType: 'Үдэшлэг',
    tone: 'noir',
    price: 35000,
    description: 'Хар дээр тод бичиг — клуб, нээлт, онцгой үдэшлэгт зориулсан.',
    sample: { title: 'BLACKOUT', date: 'SAT · 23:00' },
  },
  {
    id: 'blossom-naming',
    layout: 'romance',
    name: 'Цэцэг',
    eventType: 'Нэрийн баяр',
    tone: 'blossom',
    price: 29000,
    description: 'Зөөлөн ягаан цэцгийн өнгөтэй — нэрийн баяр, хүүхдийн баярт.',
    sample: { title: 'Наран', date: '2026.10.24' },
  },
  {
    id: 'sky-sevleg',
    layout: 'party',
    name: 'Тэнгэр',
    eventType: 'Сэвлэг үргээх',
    tone: 'sky',
    price: 29000,
    description: 'Хүүхдийн сэвлэг үргээх ёслолд зориулсан зөөлөн, гэрэлтсэн загвар.',
    sample: { title: 'Ананд', date: '5 нас' },
  },
  {
    id: 'terra-newhome',
    layout: 'minimal',
    name: 'Өргөө',
    eventType: 'Шинэ гэр',
    tone: 'terra',
    price: 35000,
    description: 'Шинэ гэр, өргөө мялаах ёслолд зориулсан монгол уламжлалт загвар.',
    sample: { title: 'Өргөө мялаалга', date: '2026.09.01' },
  },
  {
    id: 'forest-corporate',
    layout: 'minimal',
    name: 'Ой мод',
    eventType: 'Байгууллага',
    tone: 'forest',
    price: 45000,
    description: 'Байгууллагын арга хэмжээ, нээлт, семинарт зориулсан цэгц загвар.',
    sample: { title: 'FORUM 2026', date: '09.15 · UB' },
  },
]

/* Paid add-on: ceremonial opening effect on the guest page */
export const INTRO_PRICE = 9900

export const banks = ['Хаан банк', 'Голомт банк', 'Худалдаа хөгжлийн банк', 'Төрийн банк', 'Хас банк', 'М банк', 'Капитрон банк', 'Ариг банк', 'Богд банк']

export const curtainColors = [
  { id: 'violet', name: 'Нил ягаан' },
  { id: 'burgundy', name: 'Бордо улаан' },
  { id: 'noir', name: 'Хар' },
  { id: 'navy', name: 'Шөнийн хөх' },
]

export function getTemplate(id) {
  return templates.find((template) => template.id === id) || null
}

export function formatPrice(value) {
  return `${new Intl.NumberFormat('mn-MN').format(value)}₮`
}

export function formatEventDate(value) {
  if (!value) return 'Огноо тохируулаагүй'
  // manual format: browsers without the mn-MN locale fall back to English
  const date = new Date(value)
  const pad = (part) => String(part).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} · ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const cyrillicMap = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ү: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e',
  ю: 'yu', я: 'ya',
}

export function makeSlug(title) {
  const transliterated = (title || '').toLowerCase()
    .split('').map((ch) => cyrillicMap[ch] ?? ch).join('')
  const latin = transliterated.normalize('NFKD').replace(/[̀-ͯ]/g, '')
  const compact = latin.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  return `${compact || 'urilga'}-${Math.random().toString(36).slice(2, 7)}`
}

/* Ready-made invitation messages, keyed by event type */
export const messagePresets = {
  'Хурим': [
    'Бидний хайрын баталгаа болсон энэхүү нандин мөчид хүрэлцэн ирж, гал голомтоо бадраахад минь ерөөл өргөн, аз жаргалтай оролцохыг хүндэтгэн урьж байна.',
    'Хоёр зүрх нэг болж, шинэ амьдралын гараагаа эхлүүлэх энэ өдөр таныг бидэнтэй хамт байхыг урьж байна.',
    'Амьдралын хамгийн үзэсгэлэнтэй өдрөө хайртай хүмүүсийнхээ хүрээлэлд тэмдэглэхийг хүсэж, таныг хүндэтгэн урьж байна.',
  ],
  'Төрсөн өдөр': [
    'Миний төрсөн өдрийн баярт хүрэлцэн ирж, баяр баясгалангаа хуваалцахыг урьж байна!',
    'Нэг нас нэмж буй энэ өдрөө хамгийн дотны хүмүүстэйгээ тэмдэглэхийг хүсэж байна — таныг урьж байна!',
    'Төрсөн өдрийн үдэшлэгт тавтай морилно уу — хөгжилтэй үдэш биднийг хүлээж байна!',
  ],
  'Ёслол': [
    'Энэхүү хүндэтгэлийн ёслолд хүрэлцэн ирж, баярын мөчийг бидэнтэй хуваалцахыг урьж байна.',
    'Амьдралын чухал үйл явдлаа хайртай хүмүүстэйгээ хамт тэмдэглэхийг хүсэж, таныг хүндэтгэн урьж байна.',
  ],
  'Хүлээн авалт': [
    'Хүлээн авалтад хүрэлцэн ирэхийг хүндэтгэн урьж байна. Таныг ирэхийг тэсэн ядан хүлээж байна.',
    'Онцгой үдэшлэгт таныг урьж байна — тансаг орчин, сайхан хөгжим, дотно яриа таныг хүлээж байна.',
  ],
  'Төгсөлт': [
    'Олон жилийн хөдөлмөрийн үр дүн — төгсөлтийн баяраа хамт тэмдэглэхийг урьж байна!',
    'Амжилтын баярт минь хүрэлцэн ирж, баяр хөөрөө хуваалцана уу!',
  ],
  'Ойн баяр': [
    'Бидний хамтдаа туулсан жилүүдийн ойн баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.',
    'Энэ онцгой ойн баярыг хайртай хүмүүстэйгээ хамт тэмдэглэхийг хүсэж байна — таныг урьж байна.',
  ],
  'Үдэшлэг': [
    'Мартагдашгүй үдэшлэг болно — таныг урьж байна!',
    'Онцгой үдэшлэгт тавтай морил — хувцаслалтын код болон дэлгэрэнгүйг доороос харна уу.',
  ],
  'Нэрийн баяр': [
    'Манай гэр бүлийн шинэ гишүүний нэрийн баярт хүрэлцэн ирэхийг урьж байна.',
    'Бяцхан үрийнхээ нэрийн баярыг тэмдэглэхээр таныг хүндэтгэн урьж байна.',
  ],
  'Байгууллага': [
    'Манай байгууллагын арга хэмжээнд хүрэлцэн ирэхийг урьж байна. Хөтөлбөр, дэлгэрэнгүйг доороос танилцана уу.',
    'Таныг манай арга хэмжээний хүндэт зочноор урьж байна.',
  ],
  'Сэвлэг үргээх': [
    'Хайрт үрийнхээ сэвлэг үргээх ёслолд хүрэлцэн ирж, ерөөлийн үг хайрлахыг хүндэтгэн урьж байна.',
    'Бяцхан үрийн маань анхны үсийг нь авах өлзийт ёслолд таныг урьж байна.',
  ],
  'Шинэ гэр': [
    'Шинэ өргөөгөө мялаах ёслолд хүрэлцэн ирж, сайн сайхны ерөөл хайрлахыг хүндэтгэн урьж байна.',
    'Шинэ гэрийн маань босгыг алхаж, баярын мөчийг бидэнтэй хуваалцана уу.',
  ],
}

/*
 * Fully-featured sample invitation for /demo/:templateId — shows buyers
 * exactly what the guest page (curtain, gallery, program…) looks like.
 */
export function buildDemoInvitation(templateId) {
  const template = getTemplate(templateId)
  if (!template) return null
  const eventAt = new Date(Date.now() + 30 * 86400000)
  eventAt.setHours(18, 0, 0, 0)
  const others = templates.filter((item) => item.id !== templateId).slice(0, 2)
  return {
    id: null,
    title: template.sample.title,
    event_type: template.eventType,
    event_at: eventAt.toISOString(),
    venue: 'Улаанбаатар · Тансаг өргөө',
    message: 'Бидний амьдралын онцгой мөчид хүрэлцэн ирж, баяр баясгалангаа хуваалцахыг хүндэтгэн урьж байна.',
    theme: template.tone,
    template_id: template.id,
    options: {
      gallery: [template.id, ...others.map((item) => item.id)].map((id) => `/backgrounds/${id}.jpg`),
      program: [
        { time: '16:00', activity: 'Зочид хүлээн авах' },
        { time: '17:30', activity: 'Ёслолын ажиллагаа' },
        { time: '19:00', activity: 'Хүндэтгэлийн зоог' },
      ],
      note: 'Энэ бол жишээ урилга — бүх мэдээллийг та өөрөө тохируулна.',
      phone: '9911xxxx',
      bank: { bank: 'Хаан банк', number: '5041xxxxxx', holder: template.sample.title.split(' ')[0] },
      intro: 'curtain',
      introColor: template.tone === 'noir' || template.tone === 'midnight' ? 'noir' : 'violet',
    },
  }
}

const DRAFT_KEY = 'invites.draft.v1'

export function saveDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}
