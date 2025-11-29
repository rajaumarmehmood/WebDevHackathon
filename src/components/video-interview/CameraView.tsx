'use client';

import { useEffect, useRef } from 'react';
import { Video, VideoOff } from 'lucide-react';

interface CameraViewProps {
  stream: MediaStream | null;
  cameraReady: boolean;
}

export default function CameraView({ stream, cameraReady }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 z-0">
      {cameraReady && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-900">
          <div className="text-center">
            <VideoOff className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">Initializing camera...</p>
          </div>
        </div>
      )}
      
      {/* Camera indicator */}
      {cameraReady && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">REC</span>
        </div>
      )}
    </div>
  );
}
