import { PlusIcon } from '@primer/octicons-react'
import { DesktopContext } from 'desktop/context'
import { useContext, useState } from 'react'

type Mode = 'view' | 'add'

export function Sources () {
  const [mode, setMode] = useState<Mode>('view')
  const { setModal } = useContext(DesktopContext)

  return <div className="repo">
    <div className='header'>Sources
      <div
        className='button add-button'
        title='Add'
        onClick={ () => window.showDirectoryPicker().then(async handler => {
          for await (const item of handler.values()) {
            console.log(item)
          }
        }) }
      >
        <PlusIcon />
      </div>
    </div>
  </div>
}
