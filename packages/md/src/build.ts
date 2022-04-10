import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'
import { MdOptions } from '.'

export function build (body: string, options: MdOptions) {
  const mdx = evaluateSync(body, {
    ...runtime as any,
    remarkPlugins: options.remarkPlugins,
    rehypePlugins: options.rehypePlugins,
  }).default
  return renderToString(createElement(mdx))
}
