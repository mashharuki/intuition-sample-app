import { TAB_ITEMS } from '../utils/constants'
import type { TabKey } from '../utils/types'

interface TabNavigationProps {
  activeTab: TabKey
  onSelectTab: (key: TabKey) => void
}

/**
 * タブナビゲーションコンポーネント
 * 機能タブの切り替えUIを提供します。
 */
export function TabNavigation({ activeTab, onSelectTab }: TabNavigationProps) {
  return (
    <div className="tabs">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onSelectTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
