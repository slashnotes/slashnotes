import { useEffect, useState } from 'react'

type Heading = {
  id: string
  level: number
  title: string
  items: Heading[]
}

function Content (props: {
  items?: Heading[]
}) {
  return <ul>
    {props.items.map(h => <li key={ h.id }>
      <a href={ '#' + h.id }>{ h.title }</a>
      { h.items?.length > 0 && <Content items={ h.items } />}
    </li>)}
  </ul>
}

function nest (headings: Heading[]) {
  let prev
  for (const h of headings) {
    if (h.level === 2) {
      prev = h
      continue
    }

    if (!prev.items) prev.items = []

    let items = prev.items
    for (let i = 3; i <= h.level; i++) {
      if (h.level === i) {
        items.push(h)
        break
      }

      if (items[items.length - 1])
        items = items[items.length - 1].items
    }
  }

  return headings.filter(h => h.level === 2)
}

export function Toc () {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const newHeadings = document.querySelectorAll<HTMLHeadingElement>('.view h2, .view h3, .view h4, .view h5, .view h6')

    setHeadings(nest(Array.from(newHeadings)
      .map(h => ({
        id: h.id,
        level: parseInt(h.nodeName.substring(1), 10),
        title: h.innerText,
        items: []
      }))))
  }, [])

  return headings.length ? <div className="toc">
    <Content items={ headings } />
  </div> : null
}
