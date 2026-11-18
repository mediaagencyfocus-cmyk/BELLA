import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';

interface ProductVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  compact?: boolean;
  onExpand?: () => void;
  className?: string;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Clean luxury video player that preserves the video's true natural aspect ratio
 * (horizontal, vertical, or square) without cropping, stretching, filters, or autoplay.
 */
export const ProductVideoPlayer: React.FC<ProductVideoPlayerProps> = ({
  src,
  poster,
  title = 'فيديو المنتج',
  compact = false,
  onExpand,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [naturalAspect, setNaturalAspect] = useState<string | undefined>(undefined);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setNaturalAspect(undefined);
  }, [src]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused || vid.ended) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !isMuted;
    vid.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      vid.volume = 0.8;
      setVolume(0.8);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = Number(e.target.value);
    setVolume(val);
    const vid = videoRef.current;
    if (vid) {
      vid.volume = val;
      vid.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const targetTime = Number(e.target.value);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleOpenExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pause inline video before opening larger view so audio doesn't double-play
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    if (onExpand) {
      onExpand();
    } else {
      setIsLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        style={naturalAspect ? { aspectRatio: naturalAspect } : undefined}
        className={`group/vid relative w-full rounded-[8px] overflow-hidden bg-neutral-950 flex items-center justify-center ${
          compact ? 'max-h-[420px]' : 'max-h-[520px]'
        } ${className}`}
      >
        {/* Pure, unfiltered video element preserving natural proportions */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          controls={false}
          muted={isMuted}
          onClick={togglePlay}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth > 0 && v.videoHeight > 0) {
              setNaturalAspect(`${v.videoWidth} / ${v.videoHeight}`);
            }
            if (Number.isFinite(v.duration)) {
              setDuration(v.duration);
            }
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          aria-label={title}
          className="w-full h-full max-w-full max-h-full object-contain cursor-pointer"
        />

        {/* Clear, Elegant Center Play Button (Visible when paused; no color overlay on video) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="تشغيل الفيديو"
            title="تشغيل الفيديو"
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 hover:bg-white text-slate-950 shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer z-10"
          >
            <Play className="w-6 h-6 fill-slate-950 ms-0.5" />
          </button>
        )}

        {/* Bottom Interactive Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 inset-x-0 z-10 px-3 py-2 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex flex-col gap-1.5 transition-opacity duration-200 ${
            isPlaying ? 'opacity-0 group-hover/vid:opacity-100 focus-within:opacity-100' : 'opacity-100'
          }`}
        >
          {/* Progress Bar */}
          {duration > 0 && (
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="شريط تقدم الفيديو"
              className="w-full h-1 accent-white cursor-pointer"
            />
          )}

          <div className="flex items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                  className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                {!compact && (
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="مستوى الصوت"
                    className="w-14 h-1 accent-white cursor-pointer hidden sm:block"
                  />
                )}
              </div>

              {duration > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-white/90">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenExpand}
              aria-label="تكبير الفيديو"
              title="مشاهدة بحجم أكبر"
              className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Standalone Lightbox when used inline inside ProductCard */}
      {isLightboxOpen && (
        <VideoLightboxModal
          src={src}
          title={title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

interface VideoLightboxModalProps {
  src: string;
  title?: string;
  onClose: () => void;
}

export const VideoLightboxModal: React.FC<VideoLightboxModalProps> = ({
  src,
  title = 'معاينة الفيديو',
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-60 bg-black/95 luxury-modal-backdrop flex items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="إغلاق عرض الفيديو"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="max-h-[80vh] max-w-full w-auto h-auto rounded-[8px] object-contain shadow-2xl"
        />
        {title && (
          <p className="text-center text-white text-sm font-bold mt-4 font-sans">
            {title}
          </p>
        )}
      </div>
    </div>
  );
};
