import { DesktopContext } from 'desktop/context'
import { Files } from './files'
import { useContext } from 'react'
import { selectFolder } from 'libs/io'
import { Search } from './search'

function NoFiles () {
  const { setSource } = useContext(DesktopContext)

  return <div className='header'>
    Files
    <div
      title='Open folder'
      className='open-folder'
      onClick={ async () => {
        const folder = await selectFolder()
        setSource({
          path: folder,
          name: folder.split('/').pop()
        })
      } }
    >
      Open Folder
    </div>
  </div>
}

export function Sidebar () {
  const { source } = useContext(DesktopContext)

  return <div className='sidebar'>
    {source ? <>
      <Search />
      <Files />
    </> : <NoFiles />}
  </div>
}
