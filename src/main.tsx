import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('App crashed:', error, info) }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return (
        <div style={{ padding: 24, fontFamily: 'monospace' }}>
          <h2 style={{ color: 'red' }}>App failed to render</h2>
          <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 4, overflow: 'auto' }}>
            {err.message}{'\n\n'}{err.stack}
          </pre>
        </div>
      )
    }
    return this.state.error === null ? this.props.children : null
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
