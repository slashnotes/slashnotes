import { action } from 'libs/action'
import { Fragment, useContext, useEffect, useState } from 'react'
import { run } from '@mdx-js/mdx'
import type { MDXProvider } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { DesktopContext, Item } from 'desktop/context'
import { ErrorBoundary } from './error'
import { components } from './components'
import { Toc } from './toc'

export function View({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof MDXProvider }>()
  const Content = mdxModule ? mdxModule.default : Fragment
  const [loading, setLoading] = useState(true)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const { source } = useContext(DesktopContext)

  useEffect(() => {
    setLoading(true)
    action('file/view', {
      ...item,
      folder: source.path,
    }).then(data => {
      run(data.body, { ...runtime, Fragment })
        .then(mdxModule => {
          try {
            setMdxModule(mdxModule as any)
          } catch (err) {
            console.error(err)
          }

          setLoading(false)
        })
        .catch(err => {
          console.error(err)
        })
    })

    return () => {}
  }, [item])

  return (
    <div className='view'>
      {loading ? (
        <div>Loading..</div>
      ) : (
        <ErrorBoundary>
          <div
            className='content'
            style={{ width: tocCollapsed ? '100%' : 'calc(80% - 20px)' }}
          >
            <Content components={components} />
          </div>
          <Toc collapsed={tocCollapsed} setCollapsed={setTocCollapsed} />
        </ErrorBoundary>
      )}
    </div>
  )
}
