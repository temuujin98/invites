export const invitationBackgrounds = [
  { id: 'ai-wedding-burgundy', name: 'Бордо цэцэг', url: '/backgrounds/ai-wedding-burgundy.png' },
  { id: 'ai-wedding-blush', name: 'Ягаан сувд', url: '/backgrounds/ai-wedding-blush.png' },
  { id: 'ai-wedding-navy', name: 'Шөнийн хөх', url: '/backgrounds/ai-wedding-navy.png' },
  { id: 'ai-wedding-gold', name: 'Шампан алт', url: '/backgrounds/ai-wedding-gold.png' },
]

const backgroundById = new Map(invitationBackgrounds.map((background) => [background.id, background]))

export function backgroundChoices(template) {
  if (!template) return invitationBackgrounds
  return [
    { id: '', name: `${template.name} үндсэн`, url: `/backgrounds/${template.id}.jpg` },
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
