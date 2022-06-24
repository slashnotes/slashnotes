import type { Options } from '..'

export async function Sync (action: string, _params: any, _options: Options) {
  switch (action) {
    case 'config':
      return {}
    case 'sync': {
      return {}
    }
  }
}
