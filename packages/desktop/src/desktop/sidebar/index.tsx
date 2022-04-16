import { Files } from './files'
import { Sources } from './source'

export function Sidebar () {
  return <div className='sidebar'>
    <Sources />
    <Files />
  </div>
}
