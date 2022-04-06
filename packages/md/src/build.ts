import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'
import { remarkPlugins, rehypePlugins } from './plugins'

export function build (body: string) {
  const mdx = evaluateSync(body, {
    ...runtime as any,
    remarkPlugins,
    rehypePlugins,
  }).default
  return renderToString(createElement(mdx))
}
