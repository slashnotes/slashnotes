import { DesktopContext, Item } from 'desktop/context'
import { useContext } from 'react'

export function Tab ({ item }: {
  item: Item
}) {
  const { setCurrent, setOpens } = useContext(DesktopContext)

  return <div className='tab'>
    <div
      className="name"
      onClick={ () => setCurrent(item.path) }>
      {item.name}
    </div>
    <div
      className="close"
      onClick={ () => setOpens(prev => prev.filter(i => i !== item.path)) }
    >x</div>
  </div>
}

export function CurrentTab ({ item }: {
  item: Item
}) {
  const { setOpens } = useContext(DesktopContext)

  return <div className='tab current'>
    <div className="name">
      {item.name}
    </div>
    <div
      className="close"
      onClick={ () => setOpens(prev => prev.filter(i => i !== item.path)) }
    >x</div>
  </div>
}
