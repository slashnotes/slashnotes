import { compileSync } from '@mdx-js/mdx'
import { MdOptions } from '.'

export function parse (body: string, options: MdOptions): string {
  try {
    const result = compileSync(body, {
      format: 'mdx',
      outputFormat: 'function-body',
      useDynamicImport: true,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
    })

    return String(result)
  } catch (err) {
    try {
      const result = compileSync(body, {
        format: 'md',
        outputFormat: 'function-body',
        useDynamicImport: true,
        remarkPlugins: options.remarkPlugins,
        rehypePlugins: options.rehypePlugins,
      })

      return String(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
