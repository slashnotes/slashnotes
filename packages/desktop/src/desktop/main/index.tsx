import { useContext } from 'react'
import { Tabs } from './tabs'
import { Show } from './show'
import { DesktopContext } from 'desktop/context'

export function Main () {
  const { source } = useContext(DesktopContext)

  if (!source) return null

  return <div className="main">
    <Tabs />
    <Show />
  </div>
}
