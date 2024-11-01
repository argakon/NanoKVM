import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';

import MonitorXIcon from '@/assets/images/monitor-x.svg';
import { stopFrameDetect } from '@/api/stream.ts';
import { mouseStyleAtom } from '@/jotai/mouse.ts';
import { resolutionAtom, audioMuted } from '@/jotai/screen.ts';
import { WebRTCConnection } from '@/lib/webrtc';

export const Screen = () => {
  const resolution = useAtomValue(resolutionAtom);
  const mouseStyle = useAtomValue(mouseStyleAtom);
  const isAudioMuted = useAtomValue(audioMuted);  // Audio state
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    stopFrameDetect();
    const webrtcConnection = new WebRTCConnection(/*'/api/stream/webrtc'*/);
    if (videoRef.current && audioRef.current) {
      webrtcConnection.start(videoRef.current, audioRef.current);
    }
    
    return () => {
      webrtcConnection.close();
    };
  }, [resolution]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isAudioMuted;

      if (!isAudioMuted) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isAudioMuted]);

  return (
    <div className={clsx('flex h-screen w-screen items-start justify-center xl:items-center')}>
      <video
        id="screen"
        ref={videoRef}
        className={clsx('block select-none bg-neutral-950', mouseStyle)}
        style={
          resolution?.width
            ? { width: resolution.width, height: resolution.height, objectFit: 'cover' }
            : { width: '100vw', height: '100vh', objectFit: 'scale-down' }
        }
        autoPlay
        muted
        playsInline
        poster={MonitorXIcon}
      />
      <audio 
        ref={audioRef} 
        loop 
        autoPlay 
        muted 
      />
    </div>
  );
};
