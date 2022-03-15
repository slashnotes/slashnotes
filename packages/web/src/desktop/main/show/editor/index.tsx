import {
  useEffect, useRef, useState
} from 'react'
import * as monaco from 'monaco-editor'
import './index.css'
import { action } from 'libs/action'

export function Editor ({ item }: {
  item: Item
}) {
  let editor: monaco.editor.IStandaloneCodeEditor
  const monacoEl = useRef(null)
  const [value, setValue] = useState<string>()

  useEffect(() => {
    if (monacoEl?.current) {
      editor = monaco.editor.create(monacoEl.current, {
        value: '',
        language: 'markdown',
        theme: 'vs-dark',
        fontSize: 12,
        tabSize: 2,
        wordWrap: 'on',
      })

      editor.onDidChangeModelContent(() => {
        setValue(editor.getValue())
      })
    }

    return () => editor.dispose()
  }, [])

  useEffect(() => {
    if (!item) return

    action<{ body: string }>('read', item)
      .then(data => {
        editor.setValue(data.body)
      })
  }, [item])

  useEffect(() => {
    if (!item || !value) return

    action('write', {
      ...item,
      body: value
    })
  }, [value])

  return <div
    ref={ monacoEl }
    style={ {
      width: '100%',
      height: '100%',
    } }
  ></div>
}
