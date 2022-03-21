import { DesktopContext } from 'desktop/context'
import { useContext } from 'react'
import { Tab, CurrentTab } from './tab'

export function Tabs () {
  const { items, currentItem } = useContext(DesktopContext)

  if (!items.length) return null

  return <div className='tabs'>
    {items.map(item => (currentItem === item ? <CurrentTab
      key={ item.path }
      item={ item }
    /> : <Tab
      key={ item.path }
      item={ item }
    />))}
  </div>
}
