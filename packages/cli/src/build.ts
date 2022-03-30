import type { Command } from 'commander'
import { Builder } from '@slashnotes/builder'

export function action () {
  const builder = new Builder()
}

export function Build (program: Command) {
  program
    .command('build')
    .description('build static website')
    .action(action)
}
