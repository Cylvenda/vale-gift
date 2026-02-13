import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import MessageBox from "@/components/MessageBox";
import ShareQr from "@/components/ShareQr";
import MusicToggle from "@/components/MusicToggle";
import EasterEgg from "@/components/EasterEgg";
import VisitorGate from "@/components/VisitorGate";

const REASONS = [
  "Your smile changes my whole mood.",
  "You make me feel seen.",
  "You're beautiful — inside and out.",
  "You're my favorite notification.",
  "You bring peace to my heart.",
  "You're strong, even when you don't realize it.",
  "You inspire me to do better.",
  "You're caring in the smallest ways.",
  "Being with you feels like home.",
  "You and I… just make sense.",
];

const LOVE_LETTER = `Hey my love 💖

Today I just wanted to remind you of something simple: you matter to me.

You make ordinary days feel special — with your smile, your energy, and the way you exist in my world.

If love had a sound, it would be your laugh. If peace had a place, it would be next to you.

So… I made this little surprise to say:

I choose you. I appreciate you. And I'm grateful for you.`;

const YesPage = () => {
  const [currentReason, setCurrentReason] = useState(0);

  return (
    <VisitorGate>
      <div className="relative min-h-screen romantic-gradient">
        <AnimatedBackground />
        <MusicToggle />
        <EasterEgg />

        <div className="relative z-10 max-w-xl mx-auto px-6 py-12 space-y-12">
          {/* Celebration header */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            {/* Confetti burst */}
            <div className="relative inline-block">
              {["💖", "✨", "🎉", "💘", "💕", "🌹", "🥰", "💗"].map((e, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl select-none pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                  }}
                  transition={{ duration: 2, delay: i * 0.15 }}
                >
                  {e}
                </motion.span>
              ))}
              <motion.div
                className="text-7xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                🥳
              </motion.div>
            </div>

            <motion.h1
              className="font-display text-3xl sm:text-4xl font-bold text-gradient-romantic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Yesss!! 💘
            </motion.h1>
            <motion.p
              className="font-body text-lg text-foreground/80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              You just made my heart do backflips 😭✨
              <br />
              Happy Valentine's, my love.
              <br />
              Now come here… I owe you hugs, kisses, and a beautiful memory.
            </motion.p>
          </motion.div>

          {/* Love Letter */}
          <motion.div
            className="glass-card p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl text-foreground mb-4 text-center">A Letter For You 💌</h2>
            <div className="font-body text-foreground/85 leading-relaxed whitespace-pre-line text-base">
              {LOVE_LETTER.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.015, 5) }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Reasons I Love You */}
          <motion.div
            className="glass-card p-6 sm:p-8 text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl text-foreground">Reasons I Love You 💗</h2>

            {/* Progress hearts */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {REASONS.map((_, i) => (
                <motion.span
                  key={i}
                  className={`text-lg cursor-pointer select-none ${i <= currentReason ? "" : "opacity-30"}`}
                  onClick={() => setCurrentReason(i)}
                  whileTap={{ scale: 1.3 }}
                >
                  {i <= currentReason ? "💖" : "🤍"}
                </motion.span>
              ))}
            </div>

            <motion.p
              key={currentReason}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-xl text-foreground/90 min-h-[3rem] flex items-center justify-center"
            >
              "{REASONS[currentReason]}"
            </motion.p>

            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => setCurrentReason(Math.max(0, currentReason - 1))}
                disabled={currentReason === 0}
                className="px-5 py-2 rounded-xl glass-card font-body text-foreground disabled:opacity-30"
                whileTap={{ scale: 0.9 }}
              >
                ← Prev
              </motion.button>
              <motion.button
                onClick={() => setCurrentReason(Math.min(REASONS.length - 1, currentReason + 1))}
                disabled={currentReason === REASONS.length - 1}
                className="px-5 py-2 rounded-xl bg-valentine-rose/20 font-body text-foreground disabled:opacity-30"
                whileTap={{ scale: 0.9 }}
              >
                Next →
              </motion.button>
            </div>
          </motion.div>

          {/* Message Box */}
          <MessageBox source="yes" />

          {/* Share */}
          <ShareQr />
        </div>
      </div>
    </VisitorGate>
  );
};

export default YesPage;
