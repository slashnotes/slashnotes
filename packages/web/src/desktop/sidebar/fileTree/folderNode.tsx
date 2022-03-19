import { TNode } from '.'
import { FileNode } from './fileNode'

export function FolderNode ({
  name,
  subs,
  depth,
  currentItem,
  setItems,
  setCurrentItem,
}:{
  name: string
  subs: TNode[]
  depth: number
  currentItem?: Item
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  return <div className={ 'node folder' }>
    <div
      className='name'
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
        />))}
    </div>
  </div>
}
