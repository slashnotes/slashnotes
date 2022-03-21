import { action } from 'libs/action'
import {
  useCallback, useContext, useEffect, useState
} from 'react'
import { TNode } from '.'
import { FileNode } from './fileNode'
import { DesktopContext } from 'desktop/context'

export function AddMode ({
  paths,
  setIsAdd,
}: {
  paths: string[]
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const {
    loadAllItems, setCurrentItem, setItems
  } = useContext(DesktopContext)
  const [name, setName] = useState<string>('')
  const [placeholder, setPlaceholder] = useState<string>('')

  useEffect(() => {
    const date = new Date()
    setPlaceholder(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds())
  }, [])

  const add = useCallback(() => {
    action('add', { paths: [...paths, name || placeholder] })
      .then((res) => {
        setIsAdd(false)
        loadAllItems()
        setItems(prev => [...prev, res.item])
        setCurrentItem(res.item)
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
            setIsAdd(false)
            break
        }
      } }
      placeholder={ placeholder }
    />
    <div
      className='button cancel-button'
      title='Cancel'
      onClick={ () => setIsAdd(false) }
    >X</div>
    <div
      className='button save-button'
      title='Save'
      onClick={ add }
    >Y</div>
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
  const [isAdd, setIsAdd] = useState(false)

  return <div className='node folder'>
    <div
      className='view'
      style={ { paddingLeft: (depth * 20) + 'px' } }
    >
      <div
        className='name'
        onClick={ () => setCollapsed(prev => !prev) }
        style={ { width: `${300 - (depth * 20) - 26}px` } }
      >
        {name}/
      </div>
      <div
        className='add-button button'
        title='Add'
        onClick={ () => setIsAdd(true) }
      >+</div>
    </div>
    {isAdd && <AddMode
      paths={ paths }
      setIsAdd={ setIsAdd }
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
