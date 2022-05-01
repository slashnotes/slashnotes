import {
  ChevronDownIcon, ChevronRightIcon, SearchIcon
} from '@primer/octicons-react'
import { DesktopContext } from 'desktop/context'
import { action } from 'libs/action'
import {
  useEffect, useState, useContext
} from 'react'

export function Search () {
  const [collapsed, setCollapsed] = useState(false)
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const {
    source, setOpens, setCurrent
  } = useContext(DesktopContext)

  useEffect(() => {
    if (!q) {
      setResults([])
      return
    }

    action('search/search', {
      folder: source.path,
      q,
    }).then(setResults)
  }, [q])

  return <div className="search">
    <div className='header'>
      <div
        className='name'
        onClick={ () => setCollapsed(prev => !prev) }
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        Search
      </div>
      {!collapsed && <>
        <div className='box'>
          <input
            placeholder='Keywords'
            value={ q }
            onChange={ e => setQ(e.target.value) }
          />
          <div className='button'><SearchIcon /></div>
        </div>
        {q && <div className='results'>
          {results.length ? results.map(result => <div
            className='result'
            key={ result.item.path }
            onClick={ () => {
              setOpens(prev => (prev.includes(result.item.path) ? prev : [...prev, result.item.path]))
              setCurrent(result.item.path)
            } }
          >
            {result.item.name}
          </div>) : <div>Nothing found.</div>}
        </div>}
      </>}
    </div>
  </div>
}
