import fs from 'fs'
import type { Options } from '..'
import { getConfigAll, statusMatrix } from 'isomorphic-git'
import { join } from 'path'

export async function Sync (action: string, params: any, _options: Options) {
  switch (action) {
    case 'config':
      if (!fs.existsSync(join(params.folder, '.git')))
        return {
          url: null,
          changes: [],
        }
      return {
        url: await getConfigAll({
          fs,
          dir: params.folder,
          path: 'remote.origin.url',
        }),
        changes: (await statusMatrix({
          fs,
          dir: params.folder,
        })).filter(f => f[2] !== 1).map(f => f[0]),
      }
  }
}
