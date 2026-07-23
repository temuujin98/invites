/* Invitation templates: the design lives in code, the price with the template. */

export const templates = [
  {
    id: 'lavender-wedding',
    name: 'Лаванда',
    eventType: 'Хурим',
    tone: 'lavender',
    price: 49000,
    description: 'Зөөлөн ягаан шилжилттэй, хоёр нэрийг том гаргадаг сонгодог хуримын загвар.',
    sample: { title: 'Тэмүүлэн × Номин', date: '2026.09.18' },
  },
  {
    id: 'rose-wedding',
    name: 'Сарнай',
    eventType: 'Хурим',
    tone: 'rose',
    price: 49000,
    description: 'Дулаан ягаан өнгийн романтик хуримын загвар.',
    sample: { title: 'Сүрэн × Бат', date: '2026.08.09' },
  },
  {
    id: 'coral-birthday',
    name: 'Корал',
    eventType: 'Төрсөн өдөр',
    tone: 'coral',
    price: 29000,
    description: 'Өнгөлөг, залуу — үдэшлэг, төрсөн өдөрт төгс.',
    sample: { title: 'LUNAR 27', date: 'SAT 21:00' },
  },
  {
    id: 'sage-ceremony',
    name: 'Ногоон',
    eventType: 'Ёслол',
    tone: 'sage',
    price: 39000,
    description: 'Хүндэтгэлийн ёслол, ойн баярт зориулсан тайван загвар.',
    sample: { title: 'Амараа × Номин', date: 'Улаанбаатар' },
  },
  {
    id: 'gold-reception',
    name: 'Алт',
    eventType: 'Хүлээн авалт',
    tone: 'gold',
    price: 59000,
    description: 'Гала, нээлт, албан хүлээн авалтад зориулсан тансаг загвар.',
    sample: { title: 'GALA NIGHT', date: 'FRI 19:30' },
  },
  {
    id: 'ocean-graduation',
    name: 'Далай',
    eventType: 'Төгсөлт',
    tone: 'ocean',
    price: 29000,
    description: 'Төгсөлт, амжилтын баярт зориулсан цэнхэр загвар.',
    sample: { title: 'GRAD 26', date: 'UB · JUNE' },
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
