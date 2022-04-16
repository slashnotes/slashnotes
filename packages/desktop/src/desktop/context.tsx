/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from 'libs/action'
import {
  createContext, useEffect, useMemo, useState
} from 'react'
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

export type File = {
  kind: 'file' | 'folder'
  name: string
}

export type Sources = {
  [key: string]: File[]
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

  sources: Sources
  setSources: React.Dispatch<React.SetStateAction<Sources>>
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
      sources: {},
      setSources: () => {}
    })

export function DesktopContextProvider (props: { children: JSX.Element | JSX.Element[] }) {
  const [config, setConfig] = useState<SlashnotesConfig>()
  const [opens, setOpens] = useState<string[]>([])
  const [current, setCurrent] = useState<string>()
  const [allItems, setAllItems] = useState<AllItems>({})
  const [loaded, setLoaded] = useState(false)
  const [modal, setModal] = useState({ visible: false })
  const [sources, setSources] = useState({})

  const itemsValue = useMemo(() => ({
    config,
    opens,
    setOpens,
    allItems,
    setAllItems,
    current,
    setCurrent,
    loadAllItems: () => {
      action('file/list').then(setAllItems)
    },
    modal,
    setModal,
    sources,
    setSources,
  }), [
    config,
    opens,
    setOpens,
    allItems,
    setAllItems,
    current,
    setCurrent,
    modal,
    setModal,
    sources,
    setSources,
  ])

  useEffect(() => {
    function loadConfig () {
      action('config/get')
        .then(setConfig)
        .catch(loadConfig)
    }

    loadConfig()

    function loadList () {
      action('file/list')
        .then(setAllItems)
        .catch(loadList)
    }

    loadList()
  }, [])

  useEffect(()=> {
    if (!loaded && config?.sep) setLoaded(true)
  }, [config?.sep])

  if (!loaded) return null

  return <DesktopContext.Provider value={ itemsValue }>
    {props.children}
  </DesktopContext.Provider>
}
