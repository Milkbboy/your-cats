type SettingsPageProps = {
  onReadyFriend: () => void;
};

function SettingsPage({ onReadyFriend }: SettingsPageProps) {
  return (
    <div className="settings-page">
      <button className="secondary-button" type="button" onClick={onReadyFriend}>
        친구 올 시간
      </button>
      <p>"테스트용"</p>
    </div>
  );
}

export default SettingsPage;
