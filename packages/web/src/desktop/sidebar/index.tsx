import { useState, useEffect } from 'react'
import { Item } from '..'
import { action } from '../../libs/action'
import './index.css'

export function Sidebar ({
  setItems,
  setActiveItems
}: {
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setActiveItems: React.Dispatch<React.SetStateAction<Item[]>>
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
      className='item'
      onClick={ () => {
        setItems(prev => (prev.includes(post) ? prev : [...prev, post]))
        setActiveItems([post])
      } }
    >{post.path}</div>)}
  </div>
}
