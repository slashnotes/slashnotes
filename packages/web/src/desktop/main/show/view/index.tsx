import { action } from 'libs/action'
import {
  Fragment, useEffect, useState
} from 'react'
import { MDXProvider } from '@mdx-js/react'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime.js'

export function View ({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof Fragment }>()
  const Content = mdxModule ? mdxModule.default : Fragment

  useEffect(() => {
    action('view', item).then(data => {
      console.log(data.body)
      run(data.body, runtime)
        .then(mdxModule => setMdxModule(mdxModule))
        .catch(err => {
          console.error(err)
        })
    })
  }, [item])

  return <div className="view"><MDXProvider><Content /></MDXProvider></div>
}
