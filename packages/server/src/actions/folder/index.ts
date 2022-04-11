import { ServerResponse } from 'http'
import { join } from 'path'
import {
  existsSync, mkdirSync, renameSync
} from 'fs'

export function Folder (props: {
  command: string
  headers: {
    [key: string]: string
  }
  res: ServerResponse
  folder: string
  data: any
}) {
  switch (props.command) {
    case 'rename': {
      const dir = join(props.folder, props.data.to)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })
      renameSync(join(props.folder, props.data.from), join(props.folder, props.data.to))
      props.res
        .writeHead(201, props.headers)
        .end()
      return
    }
    default:
      props.res
        .writeHead(500, {
          ...props.headers,
          'Content-Type': 'text/plain'
        })
        .end('Unknown command: folder/' + props.command)
      return
  }
}
