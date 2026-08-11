/*
 * Generated backdrops the host can pick instead of the template's own photo.
 * Each one ships as two WebP files — the full-size image for the guest page
 * and a 400px thumb for the picker grid. See scripts/optimize-backgrounds.mjs.
 *
 * `events` lists the event types a backdrop belongs to, so a birthday host is
 * not offered wedding florals. Every template has at least one of its own.
 */
const backdrop = (id, name, events) => ({
  id,
  name,
  events,
  url: `/backgrounds/${id}.webp`,
  thumb: `/backgrounds/${id}-thumb.webp`,
})

export const invitationBackgrounds = [
  backdrop('ai-wedding-burgundy', 'Бордо цэцэг', ['Хурим']),
  backdrop('ai-wedding-blush', 'Ягаан сувд', ['Хурим']),
  backdrop('ai-wedding-navy', 'Шөнийн хөх', ['Хурим']),
  backdrop('ai-wedding-gold', 'Шампан алт', ['Хурим']),
  backdrop('ai-birthday-coral', 'Шүрэн баяр', ['Төрсөн өдөр']),
  backdrop('ai-ceremony-sage', 'Намуун ногоон', ['Ёслол']),
  backdrop('ai-reception-champagne', 'Шампан гэрэл', ['Хүлээн авалт']),
  backdrop('ai-graduation-ocean', 'Далайн номин', ['Төгсөлт']),
  backdrop('ai-anniversary-midnight', 'Шөнө дунд', ['Ойн баяр']),
  backdrop('ai-party-noir', 'Хар торгон', ['Үдэшлэг']),
  backdrop('ai-naming-blossom', 'Цэцгийн дэлбээ', ['Нэрийн баяр']),
  backdrop('ai-sevleg-sky', 'Тэнгэрийн цэнхэр', ['Сэвлэг үргээх']),
  backdrop('ai-newhome-terra', 'Шавар улбар', ['Шинэ гэр']),
  backdrop('ai-corporate-forest', 'Ой мод', ['Байгууллага']),
]

const backgroundById = new Map(invitationBackgrounds.map((background) => [background.id, background]))

export function backgroundChoices(template) {
  if (!template) return invitationBackgrounds
  const own = `/backgrounds/${template.id}.jpg`
  return [
    { id: '', name: `${template.name} үндсэн`, url: own, thumb: own },
    ...invitationBackgrounds.filter((background) => background.events.includes(template.eventType)),
  ]
}

export function isInvitationBackground(id) {
  return backgroundById.has(id)
}

export function invitationBackgroundUrl(id, templateId) {
  if (isInvitationBackground(id)) return backgroundById.get(id).url
  return templateId ? `/backgrounds/${templateId}.jpg` : ''
}
