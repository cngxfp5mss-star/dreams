import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FediInjectionProvider } from '@fedibtc/ui'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FediInjectionProvider>
      <App />
    </FediInjectionProvider>
  </StrictMode>,
)
