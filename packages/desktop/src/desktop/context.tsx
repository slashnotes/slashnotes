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

export const DesktopContext = createContext<{
  config: SlashnotesConfig
  opens: string[]
  setOpens: React.Dispatch<React.SetStateAction<string[]>>
  allItems: AllItems
  setAllItems: React.Dispatch<React.SetStateAction<AllItems>>
  current?: string
  setCurrent:React.Dispatch<React.SetStateAction< string | undefined>>
  loadAllItems(): void
}>({
      config: { sep: '' },
      opens: [],
      setOpens: () => {},
      allItems: {},
      setAllItems: () => {},
      current: undefined,
      setCurrent: () => {},
      loadAllItems: () => {},
    })

export function DesktopContextProvider (props: { children: JSX.Element | JSX.Element[] }) {
  const [config, setConfig] = useState<SlashnotesConfig>()
  const [opens, setOpens] = useState<string[]>([])
  const [current, setCurrent] = useState<string>()
  const [allItems, setAllItems] = useState<AllItems>({})
  const [loaded, setLoaded] = useState(false)

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
  }), [
    config,
    opens,
    setOpens,
    allItems,
    setAllItems,
    current,
    setCurrent,
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
