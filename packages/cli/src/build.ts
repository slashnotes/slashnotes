import type { Command } from 'commander'
import { Builder } from '@slashnotes/builder'
import { resolve } from 'path'

export function action (options: {
  folder: string
  destination: string
}) {
  options.folder = resolve(options.folder)
  const builder = new Builder(options)
  builder.build(options.destination)
}

export function Build (program: Command) {
  program
    .command('build')
    .description('build static website')
    .option('-f --folder <folder>', 'folder to build', '.')
    .option('-d --destination <destination>', 'destination folder', 'dist')
    .action(action)
}
