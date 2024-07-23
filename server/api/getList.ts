import { readdir } from 'node:fs/promises'

export default defineEventHandler(async () => {
  const files = await readdir('./server/data')
  return files
})
