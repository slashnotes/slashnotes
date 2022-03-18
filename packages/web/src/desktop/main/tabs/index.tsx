import { Tab, CurrentTab } from './tab'

export function Tabs ({
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
  if (!items.length) return null

  return <div className='tabs'>
    {items.map(item => (currentItem === item ? <CurrentTab
      key={ item.path }
      item={ item }
      setItems={ setItems }
    /> : <Tab
      key={ item.path }
      item={ item }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />))}
  </div>
}
