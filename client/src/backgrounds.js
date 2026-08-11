/*
 * Generated backdrops the host can pick instead of the template's own photo.
 * Each one ships as two WebP files — the full-size image for the guest page
 * and a 400px thumb for the picker grid. See scripts/optimize-backgrounds.mjs.
 */
const backdrop = (id, name) => ({
  id,
  name,
  url: `/backgrounds/${id}.webp`,
  thumb: `/backgrounds/${id}-thumb.webp`,
})

export const invitationBackgrounds = [
  backdrop('ai-wedding-burgundy', 'Бордо цэцэг'),
  backdrop('ai-wedding-blush', 'Ягаан сувд'),
  backdrop('ai-wedding-navy', 'Шөнийн хөх'),
  backdrop('ai-wedding-gold', 'Шампан алт'),
  backdrop('ai-birthday-coral', 'Шүрэн баяр'),
  backdrop('ai-ceremony-sage', 'Намуун ногоон'),
  backdrop('ai-graduation-ocean', 'Далайн номин'),
  backdrop('ai-anniversary-midnight', 'Шөнө дунд'),
  backdrop('ai-party-noir', 'Хар торгон'),
  backdrop('ai-naming-blossom', 'Цэцгийн дэлбээ'),
  backdrop('ai-newhome-terra', 'Шавар улбар'),
  backdrop('ai-corporate-forest', 'Ой мод'),
]

const backgroundById = new Map(invitationBackgrounds.map((background) => [background.id, background]))

export function backgroundChoices(template) {
  if (!template) return invitationBackgrounds
  const own = `/backgrounds/${template.id}.jpg`
  return [
    { id: '', name: `${template.name} үндсэн`, url: own, thumb: own },
    ...invitationBackgrounds,
  ]
}

export function isInvitationBackground(id) {
  return backgroundById.has(id)
}

export function invitationBackgroundUrl(id, templateId) {
  if (isInvitationBackground(id)) return backgroundById.get(id).url
  return templateId ? `/backgrounds/${templateId}.jpg` : ''
}
