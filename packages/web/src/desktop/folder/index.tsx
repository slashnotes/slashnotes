import { useState, useEffect } from 'react'
import { action } from '../../libs/action'

export function Folder () {
  const [posts, setPosts] = useState<string[]>([])

  useEffect(() => {
    action('list')
      .then(setPosts)
  }, [])

  return <div>

    <ul>
      {posts.map(post => <li key={ post }>{post}</li>)}
    </ul>
  </div>
}
