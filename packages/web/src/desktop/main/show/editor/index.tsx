import {
  useEffect, useRef, useState
} from 'react'
import { monaco } from '@slashnotes/monaco-editor-esm'
import { action } from 'libs/action'
import './worker'

export function Editor ({ item }: {
  item: Item
}) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = useRef(null)
  const [value, setValue] = useState<string>()

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
    }

    return () => editor?.dispose()
  }, [])

  useEffect(() => {
    if (!item || !editor) return

    action<{ body: string }>('read', item)
      .then(data => {
        editor.setValue(data.body)
      })
  }, [item, editor])

  useEffect(() => {
    if (!item || !value) return

    action('write', {
      ...item,
      body: value
    })
  }, [value])

  return <div
    ref={ monacoEl }
    className='editor'
  ></div>
}
