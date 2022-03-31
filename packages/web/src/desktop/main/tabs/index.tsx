import { DesktopContext } from 'desktop/context'
import { useContext, useEffect } from 'react'
import { Tab, CurrentTab } from './tab'

export function Tabs () {
  const {
    opens, current, allItems, setCurrent
  } = useContext(DesktopContext)

  useEffect(() => {
    if (!opens.length && current) {
      setCurrent(undefined)
      return
    }

    if (current && !opens.includes(current))
      setCurrent(opens[opens.length - 1])
  }, [opens])

  if (!opens.length) return null

  return <div className='tabs'>
    {opens.map(path => (current === path ? <CurrentTab
      key={ path }
      item={ allItems[path] }
    /> : <Tab
      key={ path }
      item={ allItems[path] }
    />))}
  </div>
}
