import './index.css'
import { Sidebar } from './sidebar'
import { Editor } from './editor'
import { useState } from 'react'

export type Item = {
  type: string
  path: string
}

export function Desktop () {
  const [items, setItems] = useState<Item[]>([])
  const [activeItems, setActiveItems] = useState<Item[]>([])

  return <div className='desktop'>
    <Sidebar
      setItems={ setItems }
      setActiveItems={ setActiveItems }
    />
    <Editor
      items={ items }
      setItems={ setItems }
      activeItems={ activeItems }
      setActiveItems={ setActiveItems }
    />
  </div>
}
