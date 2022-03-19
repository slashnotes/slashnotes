export function FileNode ({
  name,
  item,
  depth,
  currentItem,
  setItems,
  setCurrentItem,
}:{
  name: string
  item: Item
  depth: number
  currentItem?: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  return <div className={ `node file ${item === currentItem ? 'current' : ''}` }>
    <div
      className='name'
      style={ { paddingLeft: (depth * 20) + 'px' } }
      onClick={ () => {
        setItems(prev => (prev.includes(item) ? prev : [...prev, item]))
        setCurrentItem(item)
      } }>
      {name}
    </div>
  </div>
}
