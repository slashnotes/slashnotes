/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from 'libs/action'
import {
  createContext, useCallback, useEffect, useMemo, useState
} from 'react'

export const DesktopContext = createContext<{
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  allItems: Item[]
  setAllItems: React.Dispatch<React.SetStateAction<Item[]>>
  currentItem?: Item
  setCurrentItem:React.Dispatch<React.SetStateAction<Item | undefined>>
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
  const [items, setItems] = useState<Item[]>([])
  const [currentItem, setCurrentItem] = useState<Item>()
  const [allItems, setAllItems] = useState<Item[]>([])

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
