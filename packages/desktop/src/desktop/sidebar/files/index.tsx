import { DesktopContext, Item } from 'desktop/context'
import {
  useContext, useEffect, useState
} from 'react'
import { FileNode } from './fileNode'
import {
  AddMode, FolderNode, FolderMode
} from './folderNode'
import {
  PlusIcon, FileDirectoryIcon, ChevronDownIcon, ChevronRightIcon
} from '@primer/octicons-react'
import { selectFolder } from 'libs/io'

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

export function Files () {
  const {
    allItems, config, setSource
  } = useContext(DesktopContext)
  const [tree, setTree] = useState<TNode[]>([])
  const [mode, setMode] = useState<FolderMode>('view')
  const [collapsed, setCollapsed] = useState(false)

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

  return <div className='files'>
    <div className='header'>
      <div
        className='name'
        onClick={ () => setCollapsed(prev => !prev) }
        style={ {
          float: 'left',
          width: '240px',
        } }
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        Files
      </div>
      <div
        className='button add-button'
        onClick={ () => setMode(prev => (prev === 'view' ? 'add' : 'view')) }
        title='Add'
      >
        <PlusIcon />
      </div>
      <div
        className='button open-button'
        title='Open another folder'
        onClick={ async () => {
          const folder = await selectFolder()
          setSource({
            path: folder,
            name: folder.split('/').pop()
          })
        } }
      >
        <FileDirectoryIcon />
      </div>
    </div>
    {mode === 'add' &&
      <AddMode
        paths={ [] }
        setMode={ setMode }
      />}
    {!collapsed && tree.map(node => (node.type === 'folder' ?
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
