import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TaxHarvestingProvider } from './context/TaxHarvestingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaxHarvestingProvider>
      <App />
    </TaxHarvestingProvider>
  </StrictMode>,
)
