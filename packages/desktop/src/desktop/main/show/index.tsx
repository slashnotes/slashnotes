import { DesktopContext } from 'desktop/context'
import { useContext } from 'react'
import { Editor } from './editor'
import { View } from './view'

export function Show () {
  const {
    current, allItems, setAllItems
  } = useContext(DesktopContext)

  if (!current) return <div style={ {
    marginTop: '45vh',
    textAlign: 'center',
    fontSize: '3em',
    color: '#666' 
  } }>
    &lt;/&gt; Slashnotes
    <div style={ { fontSize: '.3em' } }>A note taking app for your whole life.</div>
  </div>

  return <div className="show">
    <div className='mode'>
      <div
        className={ allItems[current].mode === 'view' ? 'active' : '' }
        onClick={ () => {
          allItems[current].mode = 'view'
          setAllItems({ ...allItems })
        } }>View</div>
      <div
        className={ allItems[current].mode === 'edit' ? 'active' : '' }
        onClick={ () => {
          allItems[current].mode = 'edit'
          setAllItems({ ...allItems })
        } }>Edit</div>
    </div>
    {allItems[current].mode === 'view' && <View item={ allItems[current] } />}
    {allItems[current].mode === 'edit' && <Editor item={ allItems[current] } />}
  </div>
}
