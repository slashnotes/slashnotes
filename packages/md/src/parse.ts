import { compileSync } from '@mdx-js/mdx'
import { MdOptions } from '.'

export function parse (body: string, options: MdOptions): string {
  return String(compileSync(body, {
    format: 'mdx',
    outputFormat: 'function-body',
    useDynamicImport: true,
    remarkPlugins: options.remarkPlugins,
    rehypePlugins: options.rehypePlugins,
  }))
}
