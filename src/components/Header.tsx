import { getChainLabel } from '../utils/helper'

interface HeaderProps {
  chainId: number
  address?: string
  isConnected: boolean
  isConnecting: boolean
  connectError: Error | null
  onConnect: () => void
  onDisconnect: () => void
}

/**
 * Header コンポーネント
 * アプリケーションのヘッダー部分を表示し、ウォレット接続機能を提供します。
 */
export function Header({
  chainId,
  address,
  isConnected,
  isConnecting,
  connectError,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="header">
      <div>
        <div className="title">Intuition Atom Explorer</div>
        <div className="subtitle">React + TanStack Query + Wagmi</div>
      </div>
      <div className="wallet">
        <div className="wallet-info">
          <span>Chain: {getChainLabel(chainId)}</span>
          <span>Account: {address ?? '-'}</span>
        </div>
        <div className="wallet-actions">
          {!isConnected ? (
            <button
              type="button"
              className="button primary"
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? '接続中...' : 'Wallet接続'}
            </button>
          ) : (
            <button
              type="button"
              className="button"
              onClick={onDisconnect}
            >
              接続解除
            </button>
          )}
        </div>
        {connectError && (
          <div className="message error">{connectError.message}</div>
        )}
      </div>
    </header>
  )
}
