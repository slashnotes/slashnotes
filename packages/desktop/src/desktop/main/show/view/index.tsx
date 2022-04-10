import { action } from 'libs/action'
import {
  Fragment, useEffect, useState
} from 'react'
import { run } from '@mdx-js/mdx'
import type { MDXProvider } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import type { Item } from 'desktop/context'
import { ErrorBoundary } from './error'
import { components } from './components'
import { Toc } from './toc'

export function View ({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof MDXProvider }>()
  const Content = mdxModule ? mdxModule.default : Fragment
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    action('view', item).then(data => {
      run(data.body, runtime)
        .then(mdxModule => {
          try {
            setMdxModule(mdxModule)
          } catch (err) {
            console.error(err)
          }

          setLoading(false)
        })
        .catch(err => {
          console.error(err)
        })
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }, [item])

  return <div className="view">
    {loading ? <div>Loading..</div> : <ErrorBoundary>
      <Toc />
      <Content components={ components } />
    </ErrorBoundary>}
  </div>
}
