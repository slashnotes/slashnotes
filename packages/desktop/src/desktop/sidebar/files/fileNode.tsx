import { DesktopContext, Item } from 'desktop/context'
import { action } from 'libs/action'
import {
  useCallback, useContext, useEffect, useState
} from 'react'
import {
  PencilIcon, TrashIcon, CheckIcon, XIcon
} from '@primer/octicons-react'

type Mode = 'view' | 'rename' | 'delete'

function RenameMode ({
  item,
  setMode,
} : {
  item: Item
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}) {
  const { loadAllItems } = useContext(DesktopContext)
  const [path, setPath] = useState(item.path)
  const submit = useCallback(() => {
    action('file/rename', {
      from: item.path,
      to: path
    })
      .then(() => {
        loadAllItems()
        setMode('view')
      })
  }, [item.path, path])

  useEffect(() => {
    setPath(item.path)
  }, [item.path])

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
    ><XIcon /></div>
    <div
      className='button save-button'
      onClick={ submit }
      title='Save'
    ><CheckIcon /></div>
  </div>
}

export function FileNode ({
  name,
  item,
  depth,
} : {
  name: string
  item: Item
  depth: number
}) {
  const [mode, setMode] = useState<Mode>('view')
  const {
    setOpens, current, setCurrent, loadAllItems
  } = useContext(DesktopContext)
  const [hover, setHover] = useState(false)

  useEffect(() => setMode('view'), [item])

  return <div className={ `node file ${item.path === current ? 'current' : ''}` }>
    {mode === 'view' && <div
      className='view'
      style={ { paddingLeft: (depth * 20) + 'px' } }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >
      <div
        className='name'
        onClick={ () => {
          setOpens(prev => (prev.includes(item.path) ? prev : [...prev, item.path]))
          setCurrent(item.path)
        } }
        style={ { width: `${300 - (depth * 20) - 46}px` } }
      >{name}</div>
      {hover && <>
        <div
          className="delete-button button"
          title="Delete"
          onClick={ () => setMode('delete') }
        ><TrashIcon /></div>
        <div
          className="rename-button button"
          title="Rename"
          onClick={ () => setMode('rename') }
        ><PencilIcon /></div>
      </>}
    </div>}
    {mode === 'rename' && <RenameMode
      item={ item }
      setMode={ setMode }
    />}
    {mode === 'delete' && <div className='delete'>
      <div className='message'>
        Sure to delete <span>{name}</span>?
      </div>
      <div
        className='button cancel-button'
        onClick={ () => setMode('view') }><XIcon /></div>
      <div
        className='button submit-button'
        onClick={ () => {
          action('file/delete', { path: item.path })
            .then(() => {
              setOpens(prev => prev.filter(i => i !== item.path))
              loadAllItems()
            })
        } }
      ><CheckIcon /></div>
    </div>}
  </div>
}
