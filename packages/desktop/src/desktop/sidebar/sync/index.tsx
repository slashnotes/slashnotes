import { ChevronDownIcon, ChevronRightIcon } from '@primer/octicons-react'
import { DesktopContext } from 'desktop/context'
import { action } from 'libs/action'
import {
  useEffect, useState, useContext
} from 'react'

export function Sync () {
  const [collapsed, setCollapsed] = useState(false)
  const { source } = useContext(DesktopContext)
  const [data, setData] = useState<{
    url: string
    changes: string[]
  }>()
  const [syncing, setSyncing] = useState(false)

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
          {data.changes.length && <button
            className='button'
            disabled={ syncing }
            onClick={ () => {
              setSyncing(true)
              action('sync/sync', { folder: source.path })
                .finally(() => {
                  setSyncing(false)
                })
            } }>{syncing ? 'Syncing' : 'Sync'}</button>}
          <ul>
            {data.changes.map(f => <li key={ f }>{f}</li>)}
          </ul>
        </div>
      </div>}
    </div>
  </div>
}
