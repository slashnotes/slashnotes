import { Component } from 'react'

export class ErrorBoundary extends Component<any, {
  hasError: boolean
  error?: any
}> {
  constructor (props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (err: any) {
    return {
      hasError: true,
      error: err
    }
  }

  componentDidCatch (error: any, errorInfo: any) {
    console.error(error, errorInfo)
  }

  render () {
    if (this.state.hasError)
      return <div className='error'>
        <h1>Something went wrong.</h1>
        {this.state.error && <>
          <p>{this.state.error.message}</p>
          <pre>{this.state.error.stack}</pre>
        </>}
      </div>

    return this.props.children
  }
}
