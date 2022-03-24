import { unified, Plugin } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkHtml from 'remark-html'
import { defaultSchema } from 'hast-util-sanitize'
import { randomUUID } from 'crypto'

const test: Plugin = function () {
  function replaceMdxTextExpression (node: any) {
    if (['mdxTextExpression', 'mdxFlowExpression'].includes(node.type)) {
      node.type = 'script'
      node.children = []
    } else if (node.children)
      node.children.map(replaceMdxTextExpression)
  }

  return (node: any) => {
    console.log(JSON.stringify(node, null, 2))
    replaceMdxTextExpression(node)
  }
}

const schema = { ...defaultSchema }

schema.attributes.script = ['type']
schema.tagNames = schema.tagNames.concat('script')
schema.strip = []

export function parse (body: string): string {
  return String(unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(test)
    .use(remarkGfm)
    .use(remarkHtml, {
      allowDangerousHtml: true,
      sanitize: schema,
      handlers: {
        script: (h, node) => {
          console.log('node', node)
          const id = randomUUID()
          return h(node, 'root', { }, [
            {
              type: 'element',
              tagName: 'span',
              properties: { id },
              children: []
            },
            {
              type: 'element',
              tagName: 'script',
              properties: { type: 'module' },
              children: [
                {
                  type: 'text',
                  value: `document.getElementById('user-content-${id}').innerHTML=${node.value}`
                }
              ]
            },

          ])
        }
      }
    })
    .processSync(body)
  )
}
