import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const serverDirectory = resolve(process.cwd(), 'dist', 'server')

await mkdir(serverDirectory, { recursive: true })
await writeFile(resolve(serverDirectory, 'index.js'), `export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const lastSegment = url.pathname.split('/').pop() || ''
    if (!lastSegment.includes('.')) url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}\n`)
