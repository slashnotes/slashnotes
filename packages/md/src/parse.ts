import { compileSync } from '@mdx-js/mdx'
import { remarkPlugins, rehypePlugins } from './plugins'

export function parse (body: string): string {
  return String(compileSync(body, {
    format: 'mdx',
    outputFormat: 'function-body',
    useDynamicImport: true,
    remarkPlugins,
    rehypePlugins,
  }))
}
