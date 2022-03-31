import { action } from 'libs/action'
import {
  Fragment, useEffect, useState
} from 'react'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { Item } from 'desktop/context'

export function View ({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof Fragment }>()
  const Content = mdxModule ? mdxModule.default : Fragment
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    action('view', item).then(data => {
      run(data.body, runtime)
        .then(mdxModule => {
          setMdxModule(mdxModule)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
        })
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }, [item])

  return <div className="view">{loading ? <div>Loading..</div> : <Content />}</div>
}
