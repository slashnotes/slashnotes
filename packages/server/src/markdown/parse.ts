import { compileSync } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export function parse (body: string): string {
  return String(compileSync(body, {
    format: 'mdx',
    outputFormat: 'function-body',
    useDynamicImport: true,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight]
  }))
}
