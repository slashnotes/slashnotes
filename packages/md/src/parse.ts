import { compileSync } from '@mdx-js/mdx'
import { MdOptions } from '.'

export function parse (body: string, options: MdOptions): string {
  try {
    return String(compileSync(body, {
      format: 'mdx',
      outputFormat: 'function-body',
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
    }))
  } catch (_) {
    return String(compileSync(body, {
      format: 'md',
      outputFormat: 'function-body',
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
    }))
  }
}
