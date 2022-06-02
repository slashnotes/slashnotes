import type { Command } from 'commander'
import { resolve } from 'path'
import Md from '@slashnotes/md'
import Web from '@slashnotes/web'
import { Actions } from '@slashnotes/core'

export function action (options: {
  folder: string
  destination: string
}) {
  Actions('folder/generate', {
    source: resolve(options.folder),
    target: options.destination,
  }, {
    files: { '.md': Md() },
    web: Web,
  })
}

export function Build (program: Command) {
  program
    .command('build')
    .description('build static website')
    .option('-f --folder <folder>', 'folder to build', '.')
    .option('-d --destination <destination>', 'destination folder', 'dist')
    .action(action)
}
