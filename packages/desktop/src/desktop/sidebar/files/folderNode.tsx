import { action } from 'libs/action'
import {
  useCallback, useContext, useEffect, useState
} from 'react'
import { TNode } from '.'
import { FileNode } from './fileNode'
import { DesktopContext } from 'desktop/context'
import { SlashnotesItem } from '@slashnotes/types'
import {
  PlusIcon, CheckIcon, XIcon, PencilIcon
} from '@primer/octicons-react'

export type FolderMode = 'view' | 'rename' | 'add'

export function AddMode ({
  paths,
  setMode,
}: {
  paths: string[]
  setMode: React.Dispatch<React.SetStateAction<FolderMode>>
}) {
  const {
    setCurrent, setOpens, setAllItems, source,
  } = useContext(DesktopContext)
  const [name, setName] = useState<string>('')
  const [placeholder, setPlaceholder] = useState<string>('')

  useEffect(() => {
    const date = new Date()
    setPlaceholder(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds())
  }, [])

  const add = useCallback(() => {
    action<SlashnotesItem>('file/add', {
      folder: source.path,
      paths: [...paths, name || placeholder],
      type: '.md',
    })
      .then((res) => {
        setMode('view')
        setAllItems(prev => ({
          ...prev,
          [res.path]: {
            ...res,
            mode: 'edit'
          }
        }))
        setOpens(prev => [...prev, res.path])
        setCurrent(res.path)
      })
  }, [
    paths,
    name,
    placeholder
  ])

  return <div className='add'>
    <input
      autoFocus
      value={ name }
      onChange={ e => setName(e.target.value) }
      onKeyUp={ e => {
        switch (e.code) {
          case 'Enter':
            add()
            break
          case 'Escape':
            setMode('view')
            break
        }
      } }
      placeholder={ placeholder }
    />
    <div
      className='button cancel-button'
      title='Cancel'
      onClick={ () => setMode('view') }
    ><XIcon /></div>
    <div
      className='button save-button'
      title='Save'
      onClick={ add }
    ><CheckIcon /></div>
  </div>
}

function RenameMode ({
  paths,
  setMode,
} : {
  paths: string[]
  setMode: React.Dispatch<React.SetStateAction<FolderMode>>
}) {
  const {
    loadAllItems, config, source
  } = useContext(DesktopContext)
  const [path, setPath] = useState('')
  const submit = useCallback(() => {
    action('folder/rename', {
      folder: source.path,
      from: paths.join(config.sep),
      to: path
    })
      .then(() => {
        loadAllItems()
        setMode('view')
      })
  }, [paths, path])

  useEffect(() => {
    setPath(paths.join(config.sep))
  }, [paths])

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

export function FolderNode ({
  name,
  subs,
  paths,
  depth,
}:{
  name: string
  subs: TNode[]
  paths: string[]
  depth: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [hover, setHover] = useState(false)
  const [mode, setMode] = useState<FolderMode>('view')

  return <div className='node folder'>
    {mode === 'view' && <div
      className='view'
      style={ { paddingLeft: (depth * 20) + 'px' } }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >
      <div
        className='name'
        onClick={ () => setCollapsed(prev => !prev) }
        style={ { width: `${300 - (depth * 20) - 48}px` } }
      >
        {name}/
      </div>
      {hover && <>
        <div
          className='add-button button'
          title='Add'
          onClick={ () => setMode('add') }
        ><PlusIcon /></div>
        <div
          className="rename-button button"
          title="Rename"
          onClick={ () => setMode('rename') }
        ><PencilIcon /></div>
      </>}
    </div>}
    {mode === 'add' && <AddMode
      paths={ paths }
      setMode={ setMode }
    />}
    {mode === 'rename' && <RenameMode
      paths={ paths }
      setMode={ setMode }
    />}
    <div
      className='subs'
      style={ { display: collapsed ? 'none' : 'block' } }>
      {subs.map((sub, i) => (sub.type === 'folder' ?
        <FolderNode
          key={ sub.type + sub.name }
          name={ sub.name }
          subs={ sub.subs }
          paths={ [...paths, sub.name] }
          depth={ depth + 1 }
        />
        :
        <FileNode
          key={ i }
          name={ sub.name }
          item={ sub.item }
          depth={ depth + 1 }
        />))}
    </div>
  </div>
}
