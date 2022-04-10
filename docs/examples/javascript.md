# Javascript

## Math

`1 + Math.PI`

=> { 1 + Math.PI }

## Function

```js
(function now() {
  return Date.now()
})()
```

=> {
(function now() {
  return Date.now()
})()
}

## JSX

```js
export const Cat = () => <img src="https://placekitten.com/200/200" />

<Cat />
```

=>

export const Cat = () => <img src="https://placekitten.com/200/200" />

<Cat />

## ESM

```js
import dayjs from 'https://esm.run/dayjs'

Tomorrow is { dayjs().add(1, 'd').format('dddd, YYYY-MM-DD.') }
```

=>

import dayjs from 'https://esm.run/dayjs'

Tomorrow is { dayjs().add(1, 'd').format('dddd, YYYY-MM-DD.') }

## React

```js
export const Clicker = () => {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(p => p + 1)}>Clicked {count} times</button>
}
```

=>

export const Clicker = () => {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(p => p + 1)}>Clicked {count} times</button>
}

<Clicker />
