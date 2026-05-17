type SettingsPageProps = {
  onReadyFriend: () => void;
  onSoundVolumeChange: (volume: number) => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  soundVolume: number;
};

function SettingsPage({
  onReadyFriend,
  onSoundVolumeChange,
  onToggleSound,
  soundEnabled,
  soundVolume,
}: SettingsPageProps) {
  const soundVolumePercent = Math.round(soundVolume * 100);

  return (
    <div className="settings-page">
      <button className="secondary-button" type="button" onClick={onToggleSound}>
        효과음 {soundEnabled ? '켜짐' : '꺼짐'}
      </button>
      <label className="sound-volume-control">
        <span>소리 크기 {soundVolumePercent}</span>
        <input
          aria-label="소리 크기"
          max="100"
          min="0"
          onChange={(event) => onSoundVolumeChange(Number(event.currentTarget.value) / 100)}
          step="5"
          type="range"
          value={soundVolumePercent}
        />
      </label>
      <button className="secondary-button" type="button" onClick={onReadyFriend}>
        친구 올 시간
      </button>
      <p>"테스트용"</p>
    </div>
  );
}

export default SettingsPage;
