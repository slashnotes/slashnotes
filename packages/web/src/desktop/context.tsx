/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from 'libs/action'
import {
  createContext, useCallback, useEffect, useMemo, useState
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

export function DesktopContextProvider ({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [config, setConfig] = useState<SlashnotesConfig>()
  const [opens, setOpens] = useState<string[]>([])
  const [current, setCurrent] = useState<string>()
  const [allItems, setAllItems] = useState<AllItems>({})

  const loadAllItems = useCallback(() => {
    action('config/get').then(setConfig)
    action('list').then(setAllItems)
  }, [setAllItems])

  const itemsValue = useMemo(() => ({
    config,
    opens,
    setOpens,
    allItems,
    setAllItems,
    current,
    setCurrent,
    loadAllItems,
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
    if (!opens.length) {
      setCurrent(undefined)
      return
    }

    if (current && !opens.includes(current))
      setCurrent(opens[opens.length - 1])
  }, [opens])

  return <DesktopContext.Provider value={ itemsValue }>
    {children}
  </DesktopContext.Provider>
}
