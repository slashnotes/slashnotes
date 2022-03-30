import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'

export function build (body: string) {
  const mdx = evaluateSync(body, {
    ...runtime as any,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight]
  }).default
  return renderToString(createElement(mdx))
}
