export type TabKey = 'home' | 'collection' | 'settings';

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'home', label: '홈' },
  { key: 'collection', label: '컬렉션' },
  { key: 'settings', label: '설정' },
];

function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 화면">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
