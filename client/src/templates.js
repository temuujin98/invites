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

export function makeSlug(title) {
  const latin = (title || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  const compact = latin.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${compact || 'urilga'}-${Math.random().toString(36).slice(2, 7)}`
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
