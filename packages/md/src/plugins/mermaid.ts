import type { Transformer } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

export function mermaidPlugin (): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, (node: any) => {
      if (node.type === 'code' && node.lang === 'mermaid') {
        node.type = 'block'
        node.children = [
          {
            type: 'text',
            value: node.value
          }
        ]
        const data = node.data || (node.data = {})
        data.hName = 'pre'
        data.hProperties = { className: 'mermaid' }
      }
    })
  }
}
