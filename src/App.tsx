import { useState } from 'react';
import BottomNav, { type TabKey } from './components/BottomNav';
import { useCatAppState } from './hooks/useCatAppState';
import { useCatSounds } from './hooks/useCatSounds';
import CollectionPage from './pages/CollectionPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

const pageTitles: Record<TabKey, string> = {
  home: '당신의 고양이',
  collection: '내 고양이들',
  settings: '설정',
};

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const catApp = useCatAppState();
  const catSounds = useCatSounds();

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>{pageTitles[activeTab]}</h1>
      </header>

      <section className="page-area">
        {activeTab === 'home' && (
          <HomePage
            cat={catApp.currentCat}
            canMeetFriend={catApp.canMeetFriend}
            onMeetFriend={catApp.meetFriend}
            onOpenCollection={() => setActiveTab('collection')}
            onPlayNewFriendSound={catSounds.playNewFriendSound}
            onPlayPatSound={catSounds.playPatSound}
            remainingText={catApp.remainingText}
          />
        )}
        {activeTab === 'collection' && (
          <CollectionPage
            collectedCatIds={catApp.appState.collectedCatIds}
            metDatesByCatId={catApp.appState.metDatesByCatId}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPage
            onReadyFriend={catApp.readyFriend}
            onToggleSound={catSounds.toggleSoundEnabled}
            soundEnabled={catSounds.soundEnabled}
          />
        )}
      </section>

      {activeTab !== 'home' && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </main>
  );
}

export default App;
