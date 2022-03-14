import React from 'react'
import ReactDOM from 'react-dom'
import { Desktop } from './desktop'
import { Mobile } from './mobile'

ReactDOM.render(
  <React.StrictMode>
    {window.innerWidth < 600 ? <Mobile /> : <Desktop />}
  </React.StrictMode>,
  document.getElementById('root')
)
