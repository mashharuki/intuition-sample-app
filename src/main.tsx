import { intuitionMainnet, intuitionTestnet } from '@0xintuition/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import App from './App.tsx'
import './css/index.css'

// QraphQL用のクライアント
const QUERY_CLIENT: QueryClient = new QueryClient()

// Wagmi用の設定
const WAGMI_CONFIG = createConfig({
  chains: [intuitionMainnet, intuitionTestnet],
  connectors: [injected()],
  transports: {
    [intuitionMainnet.id]: http(),
    [intuitionTestnet.id]: http(),
  },
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
