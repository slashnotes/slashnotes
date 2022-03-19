import { TNode } from '.'
import { FileNode } from './fileNode'

export function FolderNode ({
  name,
  subs,
  depth,
  currentItem,
  setItems,
  setCurrentItem,
  loadAllItems,
}:{
  name: string
  subs: TNode[]
  depth: number
  currentItem?: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  loadAllItems(): void
}) {
  return <div className={ 'node folder' }>
    <div
      className='view'
      style={ { paddingLeft: (depth * 20) + 'px' } }
    >{name}/</div>
    <div className='subs'>
      {subs!.map((sub, i) => (sub.type === 'folder' ?
        <FolderNode
          key={ sub.type + sub.name }
          name={ sub.name }
          subs={ sub.subs }
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
