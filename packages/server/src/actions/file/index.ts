import { SlashnotesFile, SlashnotesItem } from '@slashnotes/types'
import { ServerResponse } from 'http'
import {
  sep, join, extname, dirname, basename,
} from 'path'
import {
  readdirSync, statSync, existsSync, mkdirSync, renameSync, rmSync
} from 'fs'

type Files = {
  [type: string]: SlashnotesFile
}

type AllFiles = {
  [path: string]: SlashnotesItem & {
    mode: 'view'
  }
}

function findFiles (dir: string, cwd: string, files: Files, prev?: AllFiles): AllFiles {
  if (!prev) prev = {}

  readdirSync(dir).forEach(f => {
    const subPath = join(dir, f)
    if (statSync(subPath).isDirectory() && !subPath.includes('node_modules'))
      return findFiles(subPath, cwd, files, prev)

    const ext = extname(f)
    if (files[ext]) {
      const path = subPath.replace(cwd, '')
      const paths = path.split(sep)
      prev[path] = {
        path,
        name: paths[paths.length - 1],
        type: ext,
        mode: 'view',
      }
    }
  })

  return prev
}

export function File (props: {
  command: string
  headers: {
    [key: string]: string
  }
  res: ServerResponse
  folder: string
  files: {
    [key: string]: SlashnotesFile
  }
  data: any
}) {
  switch (props.command) {
    case 'list':
      props.res
        .writeHead(200, props.headers)
        .end(JSON.stringify(findFiles(props.folder, props.folder + sep, props.files)))
      return
    case 'read':
      if (!props.files[props.data.type]) throw Error('Unknown file type: ' + props.data.type)

      props.res
        .writeHead(200, props.headers)
        .end(props.files[props.data.type].read({ filename: join(props.folder, props.data.path) }))
      return
    case 'write': {
      if (!props.files[props.data.type]) throw Error('Unknown file type: ' + props.data.type)

      props.files[props.data.type].write({
        filename: join(props.folder, props.data.path),
        body: props.data.body
      })
      props.res
        .writeHead(201, props.headers)
        .end()
      return
    }
    case 'view': {
      if (!props.files[props.data.type]) throw Error('Unknown file type: ' + props.data.type)

      props.res
        .writeHead(200, props.headers)
        .end(props.files[props.data.type].render({ filename: join(props.folder, props.data.path) }))
      return
    }
    case 'rename': {
      const dir = join(props.folder, dirname(props.data.to))
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })
      renameSync(join(props.folder, props.data.from), join(props.folder, props.data.to))
      props.res
        .writeHead(201, props.headers)
        .end()
      return
    }
    case 'add': {
      if (!props.files[props.data.type]) throw Error('Unknown file type: ' + props.data.type)

      const path = join(props.folder, ...props.data.paths) + props.data.type
      const dir = dirname(path)
      if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })

      props.files[props.data.type].create({ filename: path })

      props.res
        .writeHead(200, props.headers)
        .end(JSON.stringify({
          type: props.data.type,
          name: basename(path),
          path: path.replace(props.folder + sep, ''),
        }))
      return
    }
    case 'delete': {
      rmSync(join(props.folder, props.data.path))
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
        .end('Unknown command: file/' + props.command)
      return
  }
}
