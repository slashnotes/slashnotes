import { FileTree } from './fileTree'

export function Sidebar ({
  allItems,
  setItems,
  currentItem,
  setCurrentItem,
  loadAllItems,
}: {
  allItems: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  loadAllItems(): void
}) {
  return <div className='sidebar'>
    <div className='header'>Files</div>
    <FileTree
      items={ allItems }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
      loadAllItems={ loadAllItems }
    />
  </div>
}
