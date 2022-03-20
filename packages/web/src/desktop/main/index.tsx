import { Tabs } from './tabs'
import { Show } from './show'

export function Main ({
  items,
  setItems,
  currentItem,
  setCurrentItem,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  return <div className="main">
    <Tabs
      items={ items }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
    <Show
      item={ currentItem }
    />
  </div>
}
