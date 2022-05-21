import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'
import { MdOptions } from '.'

export function build (content: string, options: MdOptions) {
  try {
    const mdx = evaluateSync(content, {
      ...runtime as any,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      format: 'mdx',
    }).default
    return createElement(mdx)
  } catch (err) {
    const mdx = evaluateSync(content, {
      ...runtime as any,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      format: 'md',
    }).default
    return createElement(mdx)
  }
}
