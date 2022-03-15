import { action } from 'libs/action'
import {
  Fragment, useEffect, useState
} from 'react'
import { runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime.js'

export function View ({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof Fragment }>()
  const Content = mdxModule ? mdxModule.default : Fragment

  useEffect(() => {
    action('view', item).then(data => {
      setMdxModule(runSync(data.body, runtime))
    })
  }, [item])

  return <div className="view"><Content /></div>
}
