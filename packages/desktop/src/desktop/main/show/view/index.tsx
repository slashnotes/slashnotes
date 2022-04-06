import { action } from 'libs/action'
import {
  Fragment, useContext, useEffect, useState
} from 'react'
import { run } from '@mdx-js/mdx'
import type { MDXProvider } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { DesktopContext, Item } from 'desktop/context'
import mermaid from 'mermaid'

function Link (props: {
  href?: string
  children?: any
}): JSX.Element {
  const { setCurrent, setOpens } = useContext(DesktopContext)

  return <a onClick={ () => {
    if (!props.href) return

    if (!props.href.startsWith('http:') && !props.href.startsWith('https:')) {
      setOpens(prev => (prev.includes(props.href) ? prev : [...prev, props.href]))
      setCurrent(props.href)
      return
    }

    window.open(props.href, '_blank')
  } }>{props.children}</a>
}

function Mermaid (props: {
  className?: string
  children?: any
}) {
  const [svg, setSvg] = useState('')

  if (typeof props.children !== 'string')
    return null

  useEffect(() => {
    mermaid.render('Mermaid_' + window.crypto.getRandomValues(new Uint32Array(1))[0].toString(),
      props.children.includes('%%{init') ? props.children : '%%{init:{\'theme\':\'dark\'}}%%\n' + props.children,
      html => setSvg(html))
  }, [props.children])

  return <div
    className={ props.className }
    dangerouslySetInnerHTML={ { __html: svg } }
  ></div>
}

function Pre (props: {
  className?: string
  children?: any
}) {
  if (props.className === 'mermaid') return <Mermaid { ...props } />

  return <pre className={ props.className }>{props.children}</pre>
}

export function View ({ item }: { item: Item }) {
  const [mdxModule, setMdxModule] = useState<{ default: typeof MDXProvider }>()
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

  return <div className="view">
    {loading ? <div>Loading..</div> : <Content components={ {
      a: Link,
      pre: Pre,
    } } />}
  </div>
}
