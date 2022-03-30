import { SlashnotesItem } from '@slashnotes/types'
import { DesktopContext } from 'desktop/context'
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
  item: SlashnotesItem
}

export type TNode = TFolderNode | TFileNode

export function FileTree () {
  const { allItems, loadAllItems } = useContext(DesktopContext)
  const [tree, setTree] = useState<TNode[]>([])
  const [isAdd, setIsAdd] = useState(false)

  useEffect(() => {
    loadAllItems()
  }, [])

  useEffect(() => {
    console.log(allItems)
    const tree: TNode[] = []

    allItems.forEach(item => {
      if (item.paths.length === 1)
        tree.push({
          name: item.paths[0],
          type: 'file',
          item,
        })
      else {
        let root = tree
        let parent: TFolderNode

        for (let i = 0; i < item.paths.length - 1; i++) {
          parent = root.find(node => node.type === 'folder' && node.name === item.paths[i]) as TFolderNode

          if (!parent) {
            parent = {
              name: item.paths[i],
              type: 'folder',
              subs: []
            }
            root.push(parent)
          }
          root = parent.subs
        }

        parent!.subs.push({
          name: item.paths[item.paths.length - 1],
          type: 'file',
          item,
        })
      }
    })

    setTree(tree)
  }, [allItems])

  return <div className='file-tree'>
    <div className='header'>Files
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
