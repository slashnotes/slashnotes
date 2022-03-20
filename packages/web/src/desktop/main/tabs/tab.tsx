import { useState } from 'react'

export function Tab ({
  item,
  setItems,
  setCurrentItem,
}: {
  item: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
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

export function CurrentTab ({
  item,
  setItems,
}: {
  item: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}) {
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
