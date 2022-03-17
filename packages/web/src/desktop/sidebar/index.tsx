import { useState, useEffect } from 'react'
import { Item } from '..'
import { action } from '../../libs/action'

export function Sidebar ({
  setItems,
  setActiveItems,
  activeItems,
  currentItem,
  setCurrentItem,
}: {
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setActiveItems: React.Dispatch<React.SetStateAction<Item[]>>
  activeItems: Item[]
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
    {posts.map(post => <div
      key={ post.path }
      className={ `item ${currentItem === post ? 'active' : ''}` }
      onClick={ () => {
        setItems(prev => (prev.includes(post) ? prev : [...prev, post]))
        setActiveItems([post])
        setCurrentItem(post)
      } }
    >{post.path}</div>)}
  </div>
}
