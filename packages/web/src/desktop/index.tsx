import './desktop.scss'
import { Sidebar } from './sidebar'
import { Main } from './main'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { action } from 'libs/action'

export function Desktop () {
  const [items, setItems] = useState<Item[]>([])
  const [currentItem, setCurrentItem] = useState<Item>()
  const [allItems, setAllItems] = useState<Item[]>([])

  const loadAllItems = useCallback(() => {
    action('list')
      .then(setAllItems)
  }, [])

  useEffect(() => {
    loadAllItems()
  }, [])

  useEffect(() => {
    console.log(items)
    if (!items.length) {
      setCurrentItem(undefined)
      return
    }

    if (currentItem && !items.includes(currentItem))
      setCurrentItem(items[0])
  }, [items])

  return <div className='desktop'>
    <Sidebar
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
      allItems={ allItems }
      loadAllItems={ loadAllItems }
    />
    <Main
      items={ items }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
  </div>
}
