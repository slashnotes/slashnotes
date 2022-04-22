import {
  useContext,
  useEffect, useRef, useState
} from 'react'
import { monaco } from '@slashnotes/monaco-editor-esm'
import { action } from 'libs/action'
import './worker'
import { DesktopContext, Item } from 'desktop/context'

export function Editor ({ item }: {
  item: Item
}) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = useRef(null)
  const [value, setValue] = useState<string>()
  const { source } = useContext(DesktopContext)

  useEffect(() => {
    if (monacoEl?.current) {
      const ed = monaco.editor.create(monacoEl.current, {
        value: '',
        language: 'markdown',
        theme: 'vs-dark',
        fontSize: 12,
        tabSize: 2,
        wordWrap: 'on',
        minimap: { enabled: false },
        unicodeHighlight: { ambiguousCharacters: false }
      })

      setEditor(ed)

      ed.onDidChangeModelContent(() => {
        setValue(ed.getValue())
      })

      return () => ed.dispose()
    }
  }, [])

  useEffect(() => {
    if (!item || !editor) return

    action<{ body: string }>('file/read', {
      ...item,
      folder: source.path,
    })
      .then(data => {
        editor.setValue(data.body)
      })
  }, [item, editor])

  useEffect(() => {
    if (!item || !value) return

    action('file/write', {
      ...item,
      body: value,
      folder: source.path,
    })
  }, [value])

  return <div
    ref={ monacoEl }
    className='editor'
  ></div>
}
