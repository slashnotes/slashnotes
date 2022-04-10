import { DesktopContext } from 'desktop/context'
import { useCallback, useContext } from 'react'

export function A (props: {
  href?: string
  children?: any
}): JSX.Element {
  const { setCurrent, setOpens } = useContext(DesktopContext)
  const onClick = useCallback((e) => {
    e.preventDefault()

    if (!props.href) return

    if (!props.href.startsWith('http:') && !props.href.startsWith('https:')) {
      setOpens(prev => (prev.includes(props.href) ? prev : [...prev, props.href]))
      setCurrent(props.href)
      return
    }

    window.open(props.href, '_blank')
  }, [props.href])

  return <a
    onClick={ onClick }
    href={ props.href }
  >{props.children}</a>
}
