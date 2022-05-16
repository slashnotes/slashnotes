import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import { createElement } from 'react'
import { MdOptions } from '.'

const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{title}}</title>
  </head>
  <body>
    {{body}}
  </body>
</html>`

export type TemplateOptions = {
  title?: string
  body: string
}

export type BuildOptions = MdOptions & {
  filename?: string
}

export function templateRender (options: TemplateOptions) {
  return template
    .replace('{{title}}', options.title)
    .replace('{{body}}', options.body)
}

export function build (content: string, options: BuildOptions) {
  let body: string
  try {
    const mdx = evaluateSync(content, {
      ...runtime as any,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      format: 'mdx',
    }).default
    body = renderToString(createElement(mdx))
  } catch (err) {
    const mdx = evaluateSync(content, {
      ...runtime as any,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      format: 'md',
    }).default
    body = renderToString(createElement(mdx))
  }

  return templateRender({
    title: body.includes('<h1>') ? body.match(/<h1>(.*?)<\/h1>/)[1] : options.filename,
    body
  })
}
