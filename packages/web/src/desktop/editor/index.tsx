import { Item } from '..'
import {
  useEffect, useRef, useState
} from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import './useWorker'
import './index.css'
import { action } from 'libs/action'

export function Editor ({
  items,
  setItems,
  activeItems,
  setActiveItems,
}: {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  activeItems: Item[]
  setActiveItems: React.Dispatch<React.SetStateAction<Item[]>>
}) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = useRef(null)
  const [value, setValue] = useState<string>()

  useEffect(() => {
    if (monacoEl?.current && !editor) {
      const ed = monaco.editor.create(monacoEl.current, {
        value: '',
        language: 'markdown',
        theme: 'vs-dark',
        fontSize: 12,
        tabSize: 2,
        wordWrap: 'on',
      })
      setEditor(ed)

      ed.onDidChangeModelContent(() => {
        setValue(ed.getValue())
      })
    }

    return () => editor?.dispose()
  }, [monacoEl.current])

  useEffect(() => {
    if (!editor || activeItems.length < 1) return

    action<{ body: string }>('read', activeItems[0])
      .then(data => {
        editor.setValue(data.body)
      })
  }, [activeItems])

  useEffect(() => {
    if (!editor) return

    action('write', {
      ...activeItems[0],
      body: value
    })
  }, [value])

  return <div className="editor">
    {items.length > 0 && <div className='tabs'>
      {items.map(item => <div
        key={ item.path }
        className={ `tab ${activeItems.includes(item) ? 'active' : ''}` }
        onClick={ () => setActiveItems([item]) }
      >{item.path}</div>)}
    </div>}
    <div
      ref={ monacoEl }
      style={ {
        width: '100%',
        height: '100%',
      } }
    ></div>
  </div>
}
