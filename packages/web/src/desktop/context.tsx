/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from 'libs/action'
import {
  createContext, useCallback, useEffect, useMemo, useState
} from 'react'
import { SlashnotesItem } from '@slashnotes/types'

export const DesktopContext = createContext<{
  items: SlashnotesItem[]
  setItems: React.Dispatch<React.SetStateAction<SlashnotesItem[]>>
  allItems: SlashnotesItem[]
  setAllItems: React.Dispatch<React.SetStateAction<SlashnotesItem[]>>
  currentItem?: SlashnotesItem
  setCurrentItem:React.Dispatch<React.SetStateAction<SlashnotesItem | undefined>>
  loadAllItems(): void
}>({
      items: [],
      setItems: () => {},
      allItems: [],
      setAllItems: () => {},
      currentItem: undefined,
      setCurrentItem: () => {},
      loadAllItems: () => {},
    })

export function DesktopContextProvider ({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [items, setItems] = useState<SlashnotesItem[]>([])
  const [currentItem, setCurrentItem] = useState<SlashnotesItem>()
  const [allItems, setAllItems] = useState<SlashnotesItem[]>([])

  const loadAllItems = useCallback(() => {
    action('list')
      .then(setAllItems)
  }, [setAllItems])

  const itemsValue = useMemo(() => ({
    items,
    setItems,
    allItems,
    setAllItems,
    currentItem,
    setCurrentItem,
    loadAllItems,
  }), [
    items,
    setItems,
    allItems,
    setAllItems,
    currentItem,
    setCurrentItem,
  ])

  useEffect(() => {
    if (!items.length) {
      setCurrentItem(undefined)
      return
    }

    if (currentItem && !items.includes(currentItem))
      setCurrentItem(items[0])
  }, [items])

  return <DesktopContext.Provider value={ itemsValue }>
    {children}
  </DesktopContext.Provider>
}
