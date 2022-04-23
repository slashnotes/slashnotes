import { useContext } from 'react'
import { DesktopContext } from './context'
import { XIcon } from '@primer/octicons-react'

export function Modal () {
  const { modal, setModal } = useContext(DesktopContext)

  return <div
    className="modal"
    style={ { display: modal.visible ? 'block' : 'none' } }
  >
    <div
      className='close'
      onClick={ () => setModal({ visible: false }) }
    >
      <XIcon />
    </div>
    {modal.content}
  </div>
}
