import { readFile } from 'node:fs/promises'
import { Readable } from 'node:stream'

export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  const fileBuffer = await readFile(`./server/data/${name}`)
  const fileStream = new Readable()
  fileStream.push(fileBuffer)
  fileStream.push(null)
  event.node.res.setHeader('Content-Disposition', 'attachment; filename="file.xlsx"')
  event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  return sendStream(event, fileStream)
})
