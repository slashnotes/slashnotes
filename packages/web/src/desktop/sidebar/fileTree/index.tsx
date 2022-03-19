/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react'
import { FileNode } from './fileNode'
import { FolderNode } from './folderNode'

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

export function FileTree ({
  items,
  setItems,
  currentItem,
  setCurrentItem,
  loadAllItems,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  loadAllItems(): void
}) {
  const [tree, setTree] = useState<TNode[]>([])

  useEffect(() => {
    const tree: TNode[] = []

    items.forEach(item => {
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
  }, [items])

  return <>{
    tree.map(node => (node.type === 'folder' ?
      <FolderNode
        key={ node.type + node.name }
        name={ node.name }
        subs={ node.subs }
        depth={ 1 }
        currentItem={ currentItem }
        setCurrentItem={ setCurrentItem }
        setItems={ setItems }
        loadAllItems={ loadAllItems }
      />
      :
      <FileNode
        key={ node.type + node.name }
        name={ node.name }
        item={ node.item }
        depth={ 1 }
        currentItem={ currentItem }
        setCurrentItem={ setCurrentItem }
        setItems={ setItems }
        loadAllItems={ loadAllItems }
      />))
  }</>
}
