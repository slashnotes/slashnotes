import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import remarkDirective from 'remark-directive'
import { mermaidPlugin } from './mermaid'

export const remarkPlugins = [
  remarkDirective,
  mermaidPlugin,
  remarkGfm,
]
export const rehypePlugins = [rehypeHighlight]
