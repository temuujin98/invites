import { supabase } from './supabase'

/*
 * Resizes the chosen image client-side (max 1600px, JPEG) and uploads it
 * to the public `covers` bucket. Returns { url } or { error }.
 */
export async function uploadCover(file) {
  if (!supabase) return { error: 'not-configured' }
  if (!file.type.startsWith('image/')) return { error: 'not-image' }
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1600 / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob) return { error: 'encode-failed' }
    const path = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error } = await supabase.storage.from('covers').upload(path, blob, { contentType: 'image/jpeg' })
    if (error) return { error: 'upload-failed' }
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    return { url: data.publicUrl }
  } catch {
    return { error: 'upload-failed' }
  }
}
