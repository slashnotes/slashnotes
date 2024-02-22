import { sep } from 'path'

export function Config(name: string, _?: any) {
  switch (name) {
    case 'get':
      return { sep }
    default:
      throw Error(`Unknown command: config/${name}`)
  }
}
