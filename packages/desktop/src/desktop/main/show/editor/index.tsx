import {
  useContext,
  useEffect,
  useState
} from 'react'
import { action } from 'libs/action'
import { DesktopContext, Item } from 'desktop/context'

export function Editor ({ item }: {
  item: Item
}) {
  const [value, setValue] = useState<string>()
  const { source } = useContext(DesktopContext)

  useEffect(() => {
    if (!item) return

    action<{ body: string }>('file/read', {
      ...item,
      folder: source.path,
    })
      .then(data => {
        setValue(data.body)
      })
  }, [item])

  useEffect(() => {
    if (!item || !value) return

    action('file/write', {
      ...item,
      body: value,
      folder: source.path,
    })
  }, [value])

  return <textarea
    className='editor'
    value={ value }
    onChange={ e => setValue(e.target.value) }
  ></textarea>
}
