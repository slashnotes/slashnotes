import { Item } from '..'
import { Show } from './show'

export function Main ({
  items,
  setItems,
  activeItems,
  setActiveItems,
  currentItem,
  setCurrentItem,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  activeItems: Item[]
  setActiveItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  return <div className="main">
    {items.length > 0 && <div className='tabs'>
      {items.map(item => <div
        key={ item.path }
        className={ `tab ${currentItem === item ? 'active' : ''}` }
        onClick={ () => setCurrentItem(item) }
      >{item.path}</div>)}
    </div>}
    {currentItem && <Show
      item={ currentItem }
    />}
  </div>
}
