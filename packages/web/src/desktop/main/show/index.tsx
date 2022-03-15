import { Item } from 'desktop'
import { useState } from 'react'
import { Editor } from './editor'
import { View } from './view'
import './index.css'

export function Show ({ item }: {
  item: Item
}) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  return <div className="show">
    <div className='mode'>
      <div onClick={ () => setMode('view') }>View</div>
      <div onClick={ () => setMode('edit') }>Edit</div>
    </div>
    {mode === 'view' && <View item={ item } />}
    {mode === 'edit' && <Editor item={ item } />}
  </div>
}
