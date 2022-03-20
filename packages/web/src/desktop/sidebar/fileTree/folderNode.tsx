import { action } from 'libs/action'
import { useCallback, useState } from 'react'
import { TNode } from '.'
import { FileNode } from './fileNode'

function AddMode ({
  paths,
  setIsAdd,
  loadAllItems,
}: {
  paths: string[]
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>
  loadAllItems(): void
}) {
  const [name, setName] = useState<string>()
  const add = useCallback(() => {
    action('add', { paths: [...paths, name] })
      .then(() => {
        setIsAdd(false)
        loadAllItems()
      })
  }, [paths, name])

  return <div className='add'>
    <input
      autoFocus
      value={ name }
      onChange={ e => setName(e.target.value) }
      onKeyUp={ e => {
        switch (e.code) {
          case 'Enter':
            console.log(name)
            if (name) add()
            break
          case 'Escape':
            setIsAdd(false)
            break
        }
      } }
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
  currentItem,
  setItems,
  setCurrentItem,
  loadAllItems,
}:{
  name: string
  subs: TNode[]
  paths: string[]
  depth: number
  currentItem?: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  loadAllItems(): void
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
      loadAllItems={ loadAllItems }
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
          currentItem={ currentItem }
          setCurrentItem={ setCurrentItem }
          setItems={ setItems }
          loadAllItems={ loadAllItems }
        />
        :
        <FileNode
          key={ i }
          name={ sub.name }
          item={ sub.item }
          depth={ depth + 1 }
          currentItem={ currentItem }
          setItems={ setItems }
          setCurrentItem={ setCurrentItem }
          loadAllItems={ loadAllItems }
        />))}
    </div>
  </div>
}
