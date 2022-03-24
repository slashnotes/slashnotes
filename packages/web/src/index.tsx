import React from 'react'
import ReactDOM from 'react-dom'
import { Desktop } from './desktop'
import { Mobile } from './mobile'

declare global {
  interface Window {
    React: typeof React
    useState: typeof React.useState
    useEffect: typeof React.useEffect
    useContext: typeof React.useContext
    useReducer: typeof React.useReducer
    useCallback: typeof React.useCallback
    useMemo: typeof React.useMemo
    useRef: typeof React.useRef
    useImperativeHandle: typeof React.useImperativeHandle
    useLayoutEffect: typeof React.useLayoutEffect
    useDebugValue: typeof React.useDebugValue
  }
}

window.React = React
window.useState = React.useState
window.useEffect = React.useEffect
window.useContext = React.useContext
window.useReducer = React.useReducer
window.useCallback = React.useCallback
window.useMemo = React.useMemo
window.useRef = React.useRef
window.useImperativeHandle = React.useImperativeHandle
window.useLayoutEffect = React.useLayoutEffect
window.useDebugValue = React.useDebugValue

ReactDOM.render(
  <React.StrictMode>
    {window.innerWidth < 600 ? <Mobile /> : <Desktop />}
  </React.StrictMode>,
  document.getElementById('root')
)
