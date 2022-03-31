import { DesktopContext } from 'desktop/context'
import { useContext } from 'react'
import { Tab, CurrentTab } from './tab'

export function Tabs () {
  const {
    opens, current, allItems 
  } = useContext(DesktopContext)

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
