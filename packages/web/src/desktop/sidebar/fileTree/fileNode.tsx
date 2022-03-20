import { action } from 'libs/action'
import {
  useCallback, useEffect, useState
} from 'react'

type Mode = 'view' | 'rename' | 'delete'

function RenameMode ({
  item,
  setMode,
  loadAllItems,
} : {
  item: Item
  setMode: React.Dispatch<React.SetStateAction<Mode>>
  loadAllItems(): void
}) {
  const [path, setPath] = useState(item.path)
  const submit = useCallback(() => {
    action('rename', {
      from: item.path,
      to: path
    })
      .then(() => {
        loadAllItems()
        setMode('view')
      })
  }, [])

  useEffect(() => {
    setPath(item.path)
  }, [item])

  return <div className='rename'>
    <input
      value={ path }
      onChange={ e => setPath(e.target.value) }
      onKeyUp={ e => {
        switch (e.code) {
          case 'Enter':
            submit()
            break
          case 'Escape':
            setMode('view')
            break
        }
      } }
      autoFocus
    />
    <div
      className='button cancel-button'
      onClick={ () => setMode('view') }
      title='Cancel'
    >X</div>
    <div
      className='button save-button'
      onClick={ submit }
      title='Save'
    >Y</div>
  </div>
}

export function FileNode ({
  name,
  item,
  depth,
  currentItem,
  setItems,
  setCurrentItem,
  loadAllItems,
} : {
  name: string
  item: Item
  depth: number
  currentItem?: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  loadAllItems(): void
}) {
  const [mode, setMode] = useState<Mode>('view')

  return <div className={ `node file ${item === currentItem ? 'current' : ''}` }>
    {mode === 'view' && <div
      className='view'
      style={ { paddingLeft: (depth * 20) + 'px' } }
    >
      <div
        className='name'
        onClick={ () => {
          setItems(prev => (prev.includes(item) ? prev : [...prev, item]))
          setCurrentItem(item)
        } }
        style={ { width: `${300 - (depth * 20) - 46}px` } }
      >{name}</div>
      <div
        className="delete-button button"
        title="Delete"
        onClick={ () => setMode('delete') }
      >D</div>
      <div
        className="rename-button button"
        title="Rename"
        onClick={ () => setMode('rename') }
      >R</div>
    </div>}
    {mode === 'rename' && <RenameMode
      item={ item }
      setMode={ setMode }
      loadAllItems={ loadAllItems }
    />}
    {mode === 'delete' && <div className='delete'>
      Sure to delete <span>{name}</span>?
      <div
        className='button cancel-button'
        onClick={ () => setMode('view') }>N</div>
      <div
        className='button submit-button'
        onClick={ () => {
          action('delete', { path: item.path })
            .then(loadAllItems)
        } }
      >Y</div>
    </div>}
  </div>
}
