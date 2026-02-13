import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

const EasterEgg = () => {
  const [taps, setTaps] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleTap = () => {
    const next = taps + 1;
    setTaps(next);

    // Reset taps after 4 seconds of inactivity
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setTaps(0), 4000);

    if (next >= 7) {
      setUnlocked(true);
    }
  };

  return (
    <>
      {/* Floating tappable heart */}
      {!unlocked && (
        <motion.button
          onClick={handleTap}
          className="fixed bottom-6 left-6 z-50 text-3xl select-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 1.4 }}
          aria-label="Hidden surprise"
        >
          💖
          {taps > 0 && taps < 7 && (
            <span className="absolute -top-2 -right-2 text-xs bg-valentine-rose text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center font-body font-bold">
              {taps}
            </span>
          )}
        </motion.button>
      )}

      {/* Secret message overlay */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-6"
            onClick={() => setUnlocked(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="glass-card p-8 sm:p-12 text-center max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                😭💖
              </motion.div>
              <h2 className="font-display text-2xl text-foreground">
                Secret Unlocked!
              </h2>
              <p className="text-foreground/80 font-body text-lg leading-relaxed">
                You're my favorite person in the entire universe. Never forget that. 💕
              </p>
              <motion.button
                onClick={() => setUnlocked(false)}
                className="mt-4 px-6 py-3 rounded-xl font-body font-semibold
                  bg-gradient-to-r from-valentine-rose to-valentine-gold text-primary-foreground"
                whileTap={{ scale: 0.95 }}
              >
                Close 💫
              </motion.button>
            </motion.div>

            {/* Celebration emojis */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl select-none pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -100],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.8,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {["💖", "✨", "💕", "🌹", "💗"][i % 5]}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;
