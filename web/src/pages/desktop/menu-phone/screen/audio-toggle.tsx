import { useState } from 'react';
import { Tooltip } from 'antd';
import { VolumeXIcon, Volume2Icon, LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { audioMuted } from '@/jotai/screen.ts';

export const AudioToggle = () => {
  const { t } = useTranslation();
  const [isLoading/* setIsLoading*/] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useAtom(audioMuted);

  const toggleMute = () => {
    //if (isLoading) return;
    //setIsLoading(true);

    // Toggle mute/unmute state
    setIsAudioMuted(!isAudioMuted);
    //setIsLoading(false);
  };

  return (
    <Tooltip placement="rightTop" title={t('screen.audioToggleTip')} color="#262626" arrow>
      <div
        className="group flex h-[30px] cursor-pointer items-center space-x-2 rounded px-3 text-neutral-300 hover:bg-neutral-700"
        onClick={toggleMute}
      >
        {isLoading ? (
          <LoaderCircleIcon className="animate-spin" size={18} />
        ) : isAudioMuted ? (
          <VolumeXIcon color="#ef4444" size={18} />
        ) : (
          <Volume2Icon color="#22c55e" size={18} />
        )}
        <span className="select-none text-sm">{t('screen.audioToggle')}</span>
      </div>
    </Tooltip>
  );
};
