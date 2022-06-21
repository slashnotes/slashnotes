import { ChevronDownIcon, ChevronRightIcon } from '@primer/octicons-react'
import { DesktopContext } from 'desktop/context'
import { action } from 'libs/action'
import {
  useEffect, useState, useContext
} from 'react'

export function Sync () {
  const [collapsed, setCollapsed] = useState(true)
  const { source } = useContext(DesktopContext)
  const [data, setData] = useState<{
    url: string
    changes: string[]
  }>()

  useEffect(() => {
    action('sync/config', { folder: source.path }).then(setData)
  }, [source.path])

  return <div className="sync">
    <div className='header'>
      <div
        className='name'
        onClick={ () => setCollapsed(prev => !prev) }
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        Sync
      </div>
      {!collapsed && data && <div className='box'>
        <div className='url'>Url: {data.url}</div>
        <div className='changes'>Pending changes:
          <ul>
            {data.changes.map(f => <li key={ f }>{f}</li>)}
          </ul>
        </div>
      </div>}
    </div>
  </div>
}
