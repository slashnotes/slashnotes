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

export const Cat = function () {
  return <img src="https://placekitten.com/200/200" />
}

<Cat />

## ESM

import dayjs from 'https://esm.sh/dayjs'

Tomorrow is { dayjs().add(1, 'd').format('dddd, YYYY-MM-DD.') }
