import { useState } from 'react'

export function Heading (level: number) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return function (props: { children?: any }) {
    const [hover, setHover] = useState(false)

    return <Tag
      id={ `h${level}-${encodeURI(props.children)}` }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >
      {hover && <a
        className='anchor'
        href={ `#h${level}-${encodeURI(props.children)}` }
      >#</a>}
      { props.children }
    </Tag>
  }
}
