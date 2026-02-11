import { intuitionMainnet, intuitionTestnet } from '@0xintuition/sdk'
import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

// QraphQL用のクライアント
export const QUERY_CLIENT: QueryClient = new QueryClient()

// Wagmi用の設定
export const WAGMI_CONFIG = createConfig({
  chains: [intuitionMainnet, intuitionTestnet],
  connectors: [injected()],
  transports: {
    [intuitionMainnet.id]: http(),
    [intuitionTestnet.id]: http(),
  },
})