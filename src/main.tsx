import { intuitionTestnet } from '@0xintuition/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import App from './App.tsx'
import './index.css'

const QUERY_CLIENT: QueryClient = new QueryClient()
const WAGMI_CONFIG = createConfig({
  chains: [intuitionTestnet],
  transports: {
    [intuitionTestnet.id]: http(),
  }
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={WAGMI_CONFIG}>
      <QueryClientProvider client={QUERY_CLIENT}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
