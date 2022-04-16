import 'highlight.js/styles/github-dark-dimmed.css'
import './desktop.scss'
import { DesktopContextProvider } from './context'
import { Sidebar } from './sidebar'
import { Main } from './main'
import { Modal } from './modal'
import { memo } from 'react'

export const Desktop = memo(() => {
  return <div className='desktop'>
    <DesktopContextProvider>
      <Sidebar />
      <Main />
      <Modal />
    </DesktopContextProvider>
  </div>
})
