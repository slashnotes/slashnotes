import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'
import { MdOptions } from '.'

export function build (body: string, options: MdOptions) {
  try {
    const mdx = evaluateSync(body, {
      ...runtime as any,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      format: 'mdx',
    }).default
    return renderToString(createElement(mdx))
  } catch (err) {
    try {
      const mdx = evaluateSync(body, {
        ...runtime as any,
        remarkPlugins: options.remarkPlugins,
        rehypePlugins: options.rehypePlugins,
        format: 'md',
      }).default
      return renderToString(createElement(mdx))
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
