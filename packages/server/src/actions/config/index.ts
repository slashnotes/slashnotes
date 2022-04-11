import { ServerResponse } from 'http'
import { sep } from 'path'

export function Config (props: {
  command: string
  headers: {
    [key: string]: string
  }
  res: ServerResponse
}) {
  switch (props.command) {
    case 'get':
      props.res
        .writeHead(200, props.headers)
        .end(JSON.stringify({ sep }))
      return
    default:
      props.res
        .writeHead(500, {
          ...props.headers,
          'Content-Type': 'text/plain'
        })
        .end('Unknown command: config/' + props.command)
      return
  }
}
