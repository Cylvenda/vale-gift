import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Music, Music2, Music3, Music4, SkipForward, SkipBack } from "lucide-react";

// Playlist of romantic songs
const playlist = [
  { name: "Perfect", file: "/music1.mp3" },
  { name: "All of Me", file: "/music2.mp3" },
  { name: "Thinking Out Loud", file: "/music3.mp3" },
  { name: "A Thousand Years", file: "/music4.mp3" },
];

const MusicToggle = () => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio with current track
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false; // Don't loop individual songs
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';

      // Load the first track
      loadTrack(currentTrack);

      // Handle audio events
      audioRef.current.addEventListener('loadstart', () => setLoading(true));
      audioRef.current.addEventListener('canplay', () => setLoading(false));
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError(true);
        setLoading(false);
      });

      // Auto-play next song when current ends
      audioRef.current.addEventListener('ended', () => {
        console.log('Song ended, playing next');
        playNext();
      });
    }
  }, [currentTrack]);

  const loadTrack = (trackIndex: number) => {
    if (audioRef.current) {
      console.log('Loading track:', playlist[trackIndex].file);
      audioRef.current.src = playlist[trackIndex].file;
      audioRef.current.load();
    }
  };

  const playNext = () => {
    const nextTrack = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextTrack);
    if (playing) {
      setTimeout(() => toggle(), 100); // Small delay to load
    }
  };

  const playPrevious = () => {
    const prevTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
    if (playing) {
      setTimeout(() => toggle(), 100); // Small delay to load
    }
  };

  const toggle = async () => {
    if (!audioRef.current || error) return;

    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
        console.log('Music paused');
      } else {
        setLoading(true);
        console.log('Attempting to play:', playlist[currentTrack].file);

        // Try to play the audio
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          await playPromise;
          setPlaying(true);
          console.log('Music started successfully');
        }
      }
    } catch (err) {
      console.error('Audio play failed:', err);
      // Try to create a new audio element as fallback
      try {
        const fallbackAudio = new Audio(playlist[currentTrack].file);
        fallbackAudio.volume = 0.3;
        fallbackAudio.loop = false;
        await fallbackAudio.play();
        audioRef.current = fallbackAudio;
        setPlaying(true);
        setError(false);
        console.log('Fallback audio worked');
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <motion.div
        className="fixed top-4 right-4 z-50 glass-card px-4 py-2.5 rounded-full
          font-body text-sm text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        🎵 Music unavailable
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 glass-card p-3 rounded-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <div className="flex flex-col gap-2 min-w-[200px]">
        {/* Current track info */}
        <div className="text-center font-body text-xs text-muted-foreground">
          {playlist[currentTrack].name}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <motion.button
            onClick={playPrevious}
            className="p-1 hover:text-foreground transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={toggle}
            disabled={loading}
            className="p-2 rounded-full hover:bg-valentine-rose/20 transition-colors disabled:opacity-50"
            whileTap={{ scale: loading ? 1 : 0.9 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🎵
              </motion.div>
            ) : playing ? (
              <Music4 className="w-5 h-5" />
            ) : (
              <Music className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            onClick={playNext}
            className="p-1 hover:text-foreground transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Track indicator */}
        <div className="flex justify-center gap-1">
          {playlist.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentTrack ? 'bg-valentine-rose' : 'bg-muted-foreground/30'
                }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MusicToggle;
