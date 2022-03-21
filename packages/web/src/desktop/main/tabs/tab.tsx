import { DesktopContext } from 'desktop/context'
import { useContext } from 'react'

export function Tab ({ item }: {
  item: Item
}) {
  const { setCurrentItem, setItems } = useContext(DesktopContext)

  return <div className='tab'>
    <div
      className="name"
      onClick={ () => setCurrentItem(item) }>
      {item.name}
    </div>
    <div
      className="close"
      onClick={ () => setItems(prev => prev.filter(i => i !== item)) }
    >x</div>
  </div>
}

export function CurrentTab ({ item }: {
  item: Item
}) {
  const { setItems } = useContext(DesktopContext)

  return <div className='tab current'>
    <div className="name">
      {item.name}
    </div>
    <div
      className="close"
      onClick={ () => setItems(prev => prev.filter(i => i !== item)) }
    >x</div>
  </div>
}
