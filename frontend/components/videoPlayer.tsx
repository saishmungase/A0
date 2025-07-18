import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  X,
  SkipBack,
  SkipForward
} from 'lucide-react';

interface VideoPlayerProps {
  videoSrc: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const downloadVideo = async () => {
    const res   = await fetch(videoSrc);
    const blob  = await res.blob();              
    const url   = URL.createObjectURL(blob);     
    const ext   = blob.type.split('/')[1] || 'webm'; 
  
    const link  = document.createElement('a');
    link.href       = url;
    link.download   = `video.${ext}`;             
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = (isMuted ? 0 : volume) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 relative transform transition-all duration-600 ease-out">
      <div className="relative rounded-2xl overflow-hidden border-2 border-green-400/30 shadow-2xl bg-black">
        <div 
          className="relative group"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-auto"
            style={{ maxHeight: '60vh' }}
            onClick={togglePlay}
          >
            Your browser does not support the video tag.
          </video>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 hover:scale-110 transition-all duration-300 z-30"
          >
            <X size={18} />
          </button>

          {showControls && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 hover:scale-110 transition-all duration-300"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
          )}

          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300">
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <span className="min-w-[40px]">{formatTime(currentTime)}</span>
                  <div className="flex-1 relative">
                    <div className="w-full h-2 bg-gray-600 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="min-w-[40px]">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-green-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-green-500/30 hover:scale-110 transition-all duration-300"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button
                    onClick={() => skip(-10)}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <SkipBack size={18} />
                  </button>

                  <button
                    onClick={() => skip(10)}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <SkipForward size={18} />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <div className="relative w-20">
                      <div className="w-full h-2 bg-gray-600 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-150"
                          style={{ width: `${volumePercentage}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={downloadVideo}
                    className="w-10 h-10 bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-500/30 hover:scale-110 transition-all duration-300"
                    title="Download Video"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                    title="Fullscreen"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;