import './desktop.scss'
import { Sidebar } from './sidebar'
import { Main } from './main'
import { useState } from 'react'

export type Item = {
  type: string
  path: string
}

export function Desktop () {
  const [items, setItems] = useState<Item[]>([])
  const [activeItems, setActiveItems] = useState<Item[]>([])
  const [currentItem, setCurrentItem] = useState<Item>()

  return <div className='desktop'>
    <Sidebar
      setItems={ setItems }
      setActiveItems={ setActiveItems }
      activeItems={ activeItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
    <Main
      items={ items }
      setItems={ setItems }
      activeItems={ activeItems }
      setActiveItems={ setActiveItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
  </div>
}
