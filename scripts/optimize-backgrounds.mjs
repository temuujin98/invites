/*
 * Turns the generated PNG backdrops into what the site actually ships:
 * a full-size WebP for the guest page and a narrow WebP for the picker grid.
 *
 * The PNGs are ~2.8MB each and only ever existed as the generator's output —
 * loading twelve of them into the picker cost ~33MB. Regenerate the sources
 * with scripts/generate-backgrounds.sh when a backdrop needs to change.
 *
 *   node scripts/optimize-backgrounds.mjs [--keep-png]
 */
import { readdir, unlink, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const DIR = 'client/public/backgrounds'
const THUMB_WIDTH = 400
const keepPng = process.argv.includes('--keep-png')

const mb = (bytes) => (bytes / 1048576).toFixed(2)

const files = (await readdir(DIR)).filter((name) => name.endsWith('.png'))
if (!files.length) {
  console.log('no PNG sources left — nothing to do')
  process.exit(0)
}

let before = 0
let after = 0

for (const file of files) {
  const source = join(DIR, file)
  const base = file.replace(/\.png$/, '')
  before += (await stat(source)).size

  await sharp(source).webp({ quality: 82 }).toFile(join(DIR, `${base}.webp`))
  await sharp(source).resize({ width: THUMB_WIDTH }).webp({ quality: 72 }).toFile(join(DIR, `${base}-thumb.webp`))

  const full = (await stat(join(DIR, `${base}.webp`))).size
  const thumb = (await stat(join(DIR, `${base}-thumb.webp`))).size
  after += full + thumb
  console.log(`${base.padEnd(26)} ${mb(full)}MB full · ${mb(thumb)}MB thumb`)

  if (!keepPng) await unlink(source)
}

console.log(`\n${files.length} backdrops: ${mb(before)}MB PNG → ${mb(after)}MB WebP`)
if (keepPng) console.log('PNG sources kept (--keep-png)')
