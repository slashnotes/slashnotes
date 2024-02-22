import { useEffect, useState } from 'react'
import mermaid from 'mermaid'

function Mermaid(props: {
  className?: string
  children?: any
}) {
  const [svg, setSvg] = useState('')

  if (typeof props.children !== 'string') return null

  useEffect(() => {
    mermaid
      .render(
        `Mermaid_${window.crypto
          .getRandomValues(new Uint32Array(1))[0]
          .toString()}`,
        props.children.includes('%%{init')
          ? props.children
          : `%%{init:{\'theme\':\'dark\'}}%%\n${props.children}`
      )
      .then(res => setSvg(res.svg))
  }, [props.children])

  return (
    <div
      className={props.className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function Pre(props: {
  className?: string
  children?: any
}) {
  if (props.className === 'mermaid') return <Mermaid {...props} />

  return <pre className={props.className}>{props.children}</pre>
}
