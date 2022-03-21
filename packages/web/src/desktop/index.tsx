import './desktop.scss'
import { Sidebar } from './sidebar'
import { Main } from './main'
import { DesktopContextProvider } from './context'

export function Desktop () {
  return <div className='desktop'>
    <DesktopContextProvider>
      <Sidebar />
      <Main />
    </DesktopContextProvider>
  </div>
}
