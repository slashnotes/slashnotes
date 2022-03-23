import { action } from 'libs/action'
import {
  useEffect, useRef, useState
} from 'react'

export function View ({ item }: { item: Item }) {
  const [loading, setLoading] = useState(true)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return

    divRef.current.innerHTML = ''
    setLoading(true)
    action('view', item).then(data => {
      if (!divRef.current) return
      setLoading(false)
      const slotHtml = document.createRange().createContextualFragment(data.body)
      divRef.current.innerHTML = ''
      divRef.current.appendChild(slotHtml)
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }, [item])

  return <div className="view">{loading && <div>Loading..</div>}<div ref={ divRef }></div></div>
}
