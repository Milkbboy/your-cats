type SettingsPageProps = {
  onReadyFriend: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
};

function SettingsPage({ onReadyFriend, onToggleSound, soundEnabled }: SettingsPageProps) {
  return (
    <div className="settings-page">
      <button className="secondary-button" type="button" onClick={onToggleSound}>
        효과음 {soundEnabled ? '켜짐' : '꺼짐'}
      </button>
      <button className="secondary-button" type="button" onClick={onReadyFriend}>
        친구 올 시간
      </button>
      <p>"테스트용"</p>
    </div>
  );
}

export default SettingsPage;
