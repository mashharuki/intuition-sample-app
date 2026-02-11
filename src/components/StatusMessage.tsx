import { SUPPORTED_CHAIN_LABELS } from '../utils/constants'
import { getTransactionUrl } from '../utils/helper'

interface StatusMessageProps {
  statusMessage: string
  errorMessage: string
  lastTransactionHash: string
  lastTransactionLabel: string
  isWalletConnected: boolean
  isWalletClientReady: boolean
  isChainSupported: boolean
}

/**
 * ステータスメッセージ表示コンポーネント
 * アプリケーションの状態、エラー、トランザクション情報を表示します。
 */
export function StatusMessage({
  statusMessage,
  errorMessage,
  lastTransactionHash,
  lastTransactionLabel,
  isWalletConnected,
  isWalletClientReady,
  isChainSupported,
}: StatusMessageProps) {
  return (
    <div className="messages">
      {statusMessage && <div className="message success">{statusMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}
      {isWalletConnected && !isWalletClientReady && (
        <div className="message error">
          Walletが接続済みですが、署名に必要なクライアントを取得できません。
          接続解除してから再接続してください。
        </div>
      )}
      {lastTransactionHash && (
        <div className="message info">
          {lastTransactionLabel} Tx:{' '}
          <a
            href={getTransactionUrl(lastTransactionHash)}
            target="_blank"
            rel="noreferrer"
          >
            {lastTransactionHash}
          </a>
        </div>
      )}
      {!isChainSupported && (
        <div className="message error">
          対応チェーン: {Object.values(SUPPORTED_CHAIN_LABELS).join(', ')}
        </div>
      )}
    </div>
  )
}
