import type { Command } from 'commander'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

export function action () {
  const cwd = process.cwd()

  writeFileSync(join(cwd, 'package.json'), JSON.stringify({
    name: 'slashnotes',
    private: true,
    scripts: { start: 'slashnotes start' },
    dependencies: { '@slashnotes/cli': '*' }
  }, null, 2))

  writeFileSync(join(cwd, '.gitignore'), 'node_modules\n.DS_Store\nThumbs.db*\n*.log\n')
  writeFileSync(join(cwd, '.gitattributes'), '* text=auto eol=lf\n*.{cmd,[cC][mM][dD]} text eol=crlf\n*.{bat,[bB][aA][tT]} text eol=crlf\n')
  execSync('npm install', { stdio: 'inherit' })
}

export function Init (program: Command) {
  program
    .command('init')
    .description('Initialize Slashnotes')
    .action(action)
}
