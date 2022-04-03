import 'highlight.js/styles/github-dark-dimmed.css'
import './desktop.scss'
import { Sidebar } from './sidebar'
import { Main } from './main'
import { DesktopContextProvider } from './context'
import { memo } from 'react'

export const Desktop = memo(() => {
  return <div className='desktop'>
    <DesktopContextProvider>
      <Sidebar />
      <Main />
    </DesktopContextProvider>
  </div>
})
