import type { SlashnotesFile } from '@slashnotes/types'
import type { Plugin } from 'unified'

export type MdOptions = {
  remarkPlugins?: Plugin<any[], any>[]
  rehypePlugins?: Plugin<any[], any>[]
}

import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { mermaidPlugin } from './plugins/mermaid'

export const defaultOptions: MdOptions = {
  remarkPlugins: [mermaidPlugin, remarkGfm],
  rehypePlugins: [rehypeHighlight]
}

import { readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'
import { build } from './build'
import { parse } from './parse'

/**
 * Markdown file plugin for Slashnotes.
 *
 * @param options {MdOptions}
 * @returns SlashnotesFile
 */
function Md (options?: MdOptions): SlashnotesFile {
  if (!options) options = {}
  options.remarkPlugins = [...(options.remarkPlugins || []), ...defaultOptions.remarkPlugins]
  options.rehypePlugins = [...(options.rehypePlugins || []), ...defaultOptions.rehypePlugins]

  return {
    extname: '.md',
    read ({ filename }) {
      return { body: readFileSync(filename).toString() }
    },
    write ({ filename, body }): void {
      writeFileSync(filename, body)
    },
    render ({ filename }) {
      const file = readFileSync(filename).toString()
      return { body: parse(file, options) }
    },
    create ({ filename }): void {
      writeFileSync(filename, `# ${basename(filename).replace('.md', '')}\n\n`)
    },
    build ({ source, destination }): void {
      writeFileSync(destination, build(readFileSync(source).toString(), options))
    }
  }
}

export default Md
