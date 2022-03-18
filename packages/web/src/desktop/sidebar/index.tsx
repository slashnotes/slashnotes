import { useState, useEffect } from 'react'
import { action } from '../../libs/action'
import { FileTree } from './fileTree'

export function Sidebar ({
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
  const [posts, setPosts] = useState<Item[]>([])

  useEffect(() => {
    action('list')
      .then(setPosts)
  }, [])

  return <div className='sidebar'>
    <div className='header'>Files</div>
    <FileTree
      items={ posts }
      setItems={ setItems }
      currentItem={ currentItem }
      setCurrentItem={ setCurrentItem }
    />
  </div>
}
