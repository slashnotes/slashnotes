/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react'

type FolderNode = {
  type: 'folder'
  name: string
  subs: Node[]
}

type FileNode = {
  type: 'file'
  name: string
  item: Item
}

type Node = FolderNode | FileNode

function FileNode ({
  type,
  name,
  item,
  subs,
  depth,
  setItems,
  setCurrentItem,
}:{
  type: 'folder' | 'file'
  name: string
  item?: Item
  subs?: Node[]
  depth: number
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  return <div className={ type + ' node' }>
    <div
      className='name'
      style={ { paddingLeft: (depth * 20) + 'px' } }
      onClick={ () => {
        if (type === 'file' && item) {
          setItems(prev => (prev.includes(item) ? prev : [...prev, item]))
          setCurrentItem(item)
        }
      } }>{name}{type === 'folder' && '/'}</div>
    {type === 'folder' && <div className='subs'>
      {subs!.map((sub, i) => <FileNode
        key={ i }
        type={ sub.type }
        name={ sub.name }
        item={ sub.type === 'file' ? sub.item : undefined }
        subs={ sub.type === 'folder' ? sub.subs : undefined }
        depth={ depth + 1 }
        setItems={ setItems }
        setCurrentItem={ setCurrentItem }
      />)}
    </div>}
  </div>
}

export function FileTree ({
  items,
  setItems,
  currentItem,
  setCurrentItem,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem: React.Dispatch<React.SetStateAction<Item | undefined>>
}) {
  const [tree, setTree] = useState<Node[]>([])

  useEffect(() => {
    const tree: Node[] = []

    items.forEach(item => {
      if (item.paths.length === 1)
        tree.push({
          name: item.paths[0],
          type: 'file',
          item,
        })
      else {
        let root = tree
        let parent: FolderNode

        for (let i = 0; i < item.paths.length - 1; i++) {
          parent = root.find(node => node.type === 'folder' && node.name === item.paths[i]) as FolderNode

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

  return tree.map(node => <FileNode
    key={ node.type + node.name }
    type={ node.type }
    name={ node.name }
    item={ node.type === 'file' ? node.item : undefined }
    subs={ node.type === 'folder' ? node.subs : undefined }
    depth={ 1 }
    setCurrentItem={ setCurrentItem }
    setItems={ setItems }
  />)
}
