import { DesktopContext, Item } from 'desktop/context'
import {
  useContext, useEffect, useState
} from 'react'
import { FileNode } from './fileNode'
import { AddMode, FolderNode } from './folderNode'

export type TFolderNode = {
  type: 'folder'
  name: string
  subs: TNode[]
}

export type TFileNode = {
  type: 'file'
  name: string
  item: Item
}

export type TNode = TFolderNode | TFileNode

export function FileTree () {
  const { allItems, config } = useContext(DesktopContext)
  const [tree, setTree] = useState<TNode[]>([])
  const [isAdd, setIsAdd] = useState(false)

  useEffect(() => {
    if (!config?.sep) return

    const tree: TNode[] = []

    Object.values(allItems).forEach(item => {
      const paths = item.path.split(config.sep)

      if (paths.length === 1)
        tree.push({
          name: paths[0],
          type: 'file',
          item,
        })
      else {
        let root = tree
        let parent: TFolderNode

        for (let i = 0; i < paths.length - 1; i++) {
          parent = root.find(node => node.type === 'folder' && node.name === paths[i]) as TFolderNode

          if (!parent) {
            parent = {
              name: paths[i],
              type: 'folder',
              subs: []
            }
            root.push(parent)
          }
          root = parent.subs
        }

        parent.subs.push({
          name: paths[paths.length - 1],
          type: 'file',
          item,
        })
      }
    })

    setTree(tree)
  }, [allItems, config?.sep])

  return <div className='file-tree'>
    <div className='header'><i className="codicon codicon-folder"></i>Files
      <div
        className='button add-button'
        onClick={ () => setIsAdd(prev => !prev) }>
        +
      </div>
    </div>
    {isAdd &&
      <AddMode
        paths={ [] }
        setIsAdd={ setIsAdd }
      />}
    {tree.map(node => (node.type === 'folder' ?
      <FolderNode
        key={ node.type + node.name }
        name={ node.name }
        subs={ node.subs }
        paths={ [node.name] }
        depth={ 1 }
      />
      :
      <FileNode
        key={ node.type + node.name }
        name={ node.name }
        item={ node.item }
        depth={ 1 }
      />))}
  </div>
}
