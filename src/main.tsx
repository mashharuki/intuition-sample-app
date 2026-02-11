import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import App from './App.tsx'
import './css/index.css'
import { QUERY_CLIENT, WAGMI_CONFIG } from './utils/config.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={WAGMI_CONFIG}>
      <QueryClientProvider client={QUERY_CLIENT}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
