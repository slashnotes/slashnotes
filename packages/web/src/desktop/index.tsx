import './desktop.scss'
import { Sidebar } from './sidebar'
import { Main } from './main'
import { useEffect, useState } from 'react'

export function Desktop () {
  const [items, setItems] = useState<Item[]>([])
  const [currentItem, setCurrentItem] = useState<Item>()

  useEffect(() => {
    if (!items.length) {
      setCurrentItem(undefined)
      return
    }

    if (currentItem && !items.includes(currentItem))
      setCurrentItem(items[0])
  }, [items])

  return <div className='desktop'>
    <Sidebar
      items={ items }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
    <Main
      items={ items }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
  </div>
}
