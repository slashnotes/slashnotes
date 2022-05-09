import type { Command } from 'commander'
import { resolve } from 'path'
import Md from '@slashnotes/md'
import { Actions } from '@slashnotes/core'

export function action (options: {
  folder: string
  destination: string
}) {
  Actions('folder/generate', {
    source: resolve(options.folder),
    target: options.destination,
  }, {
    files: { '.md': Md() }
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
