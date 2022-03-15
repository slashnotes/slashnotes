import { Item } from '..'
import './index.css'
import { Show } from './show'

export function Main ({
  items,
  setItems,
  activeItems,
  setActiveItems,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  activeItems: Item[]
  setActiveItems: React.Dispatch<React.SetStateAction<Item[]>>
}) {
  return <div className="main">
    {items.length > 0 && <div className='tabs'>
      {items.map(item => <div
        key={ item.path }
        className={ `tab ${activeItems.includes(item) ? 'active' : ''}` }
        onClick={ () => setActiveItems([item]) }
      >{item.path}</div>)}
    </div>}
    {activeItems.length > 0 && <Show
      item={ activeItems[0] }
    />}
  </div>
}
