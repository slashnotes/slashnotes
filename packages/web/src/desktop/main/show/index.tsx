import { DesktopContext } from 'desktop/context'
import { useContext, useState } from 'react'
import { Editor } from './editor'
import { View } from './view'

export function Show () {
  const { currentItem } = useContext(DesktopContext)
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  if (!currentItem) return null

  return <div className="show">
    <div className='mode'>
      <div
        className={ mode === 'view' ? 'active' : '' }
        onClick={ () => setMode('view') }>View</div>
      <div
        className={ mode === 'edit' ? 'active' : '' }
        onClick={ () => setMode('edit') }>Edit</div>
    </div>
    {mode === 'view' && <View item={ currentItem } />}
    {mode === 'edit' && <Editor item={ currentItem } />}
  </div>
}
