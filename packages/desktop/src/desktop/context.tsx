import { action } from 'libs/action'
import { createContext, useEffect, useMemo, useState } from 'react'
import { SlashnotesItem, SlashnotesConfig } from '@slashnotes/types'

export type ItemMode = 'view' | 'edit'

export type Item = SlashnotesItem & {
  mode: ItemMode
}

export type AllItems = {
  [path: string]: Item
}

export type Modal = {
  visible: boolean
  content?: React.ReactNode
}

export type Source = {
  name: string
  path: string
}

export const DesktopContext = createContext<{
  config: SlashnotesConfig

  opens: string[]
  setOpens: React.Dispatch<React.SetStateAction<string[]>>

  allItems: AllItems
  setAllItems: React.Dispatch<React.SetStateAction<AllItems>>
  loadAllItems(): void

  current?: string
  setCurrent: React.Dispatch<React.SetStateAction<string | undefined>>

  modal?: Modal
  setModal: React.Dispatch<React.SetStateAction<Modal>>

  source: Source
  setSource: React.Dispatch<React.SetStateAction<Source>>
}>({
  config: { sep: '' },
  opens: [],
  setOpens: () => {},
  allItems: {},
  setAllItems: () => {},
  current: undefined,
  setCurrent: () => {},
  loadAllItems: () => {},
  modal: undefined,
  setModal: () => {},
  source: undefined,
  setSource: () => {},
})

export function DesktopContextProvider(props: {
  children: JSX.Element | JSX.Element[]
}) {
  const [config, setConfig] = useState<SlashnotesConfig>()
  const [opens, setOpens] = useState<string[]>([])
  const [current, setCurrent] = useState<string>()
  const [allItems, setAllItems] = useState<AllItems>({})
  const [loaded, setLoaded] = useState(false)
  const [modal, setModal] = useState({ visible: false })
  const [source, setSource] = useState<Source>()

  const itemsValue = useMemo(
    () => ({
      config,
      opens,
      setOpens,
      allItems,
      setAllItems,
      current,
      setCurrent,
      loadAllItems: () => {
        action('folder/list', { folder: source.path }).then(setAllItems)
      },
      modal,
      setModal,
      source,
      setSource,
    }),
    [
      config,
      opens,
      setOpens,
      allItems,
      setAllItems,
      current,
      setCurrent,
      modal,
      setModal,
      source,
      setSource,
    ]
  )

  useEffect(() => {
    function loadConfig() {
      action('config/get').then(setConfig).catch(loadConfig)
    }

    loadConfig()

    const source = localStorage.getItem('source')
    if (source) setSource(JSON.parse(source))
  }, [])

  useEffect(() => {
    if (!loaded && config?.sep) setLoaded(true)
  }, [config?.sep])

  useEffect(() => {
    if (!source) return

    localStorage.setItem('source', JSON.stringify(source))

    setOpens([])
    setCurrent(null)

    function loadList() {
      action<AllItems>('folder/list', { folder: source.path })
        .then(res => {
          setAllItems(res)
          if (!res['README.md']) return

          setOpens(['README.md'])
          setCurrent('README.md')
        })
        .catch(loadList)
    }

    loadList()
  }, [source?.path])

  if (!loaded) return null

  return (
    <DesktopContext.Provider value={itemsValue}>
      {props.children}
    </DesktopContext.Provider>
  )
}
