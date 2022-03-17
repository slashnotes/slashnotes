import { Item } from 'desktop'
import { useState } from 'react'
import { Editor } from './editor'
import { View } from './view'

export function Show ({ item }: {
  item: Item
}) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  return <div className="show">
    <div className='mode'>
      <div
        className={ mode === 'view' ? 'active' : '' }
        onClick={ () => setMode('view') }>View</div>
      <div
        className={ mode === 'edit' ? 'active' : '' }
        onClick={ () => setMode('edit') }>Edit</div>
    </div>
    {mode === 'view' && <View item={ item } />}
    {mode === 'edit' && <Editor item={ item } />}
  </div>
}
