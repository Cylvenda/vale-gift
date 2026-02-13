import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import MessageBox from "@/components/MessageBox";
import ShareQr from "@/components/ShareQr";
import MusicToggle from "@/components/MusicToggle";
import VisitorGate from "@/components/VisitorGate";

const NoPage = () => {
  return (
    <VisitorGate>
      <div className="relative min-h-screen romantic-gradient">
        <AnimatedBackground />
        <MusicToggle />

        <div className="relative z-10 max-w-xl mx-auto px-6 py-12 space-y-12">
          {/* Sad header */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-7xl"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💔
            </motion.div>

            <motion.h1
              className="font-display text-3xl sm:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Aww… my heart is crying 💔😢
            </motion.h1>

            <motion.p
              className="font-body text-lg text-muted-foreground leading-relaxed max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Ouch… okay… I'll be honest, that hurts.
              <br /><br />
              But your honesty matters more than my feelings in this moment.
              Thank you for being real with me.
              <br /><br />
              If you want, tell me what's on your heart below.
            </motion.p>
          </motion.div>

          {/* Sad animation placeholder */}
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              😢
            </motion.div>
            <p className="font-body text-muted-foreground italic">
              "It's okay. I still care about you — thank you for being honest."
            </p>
          </motion.div>

          {/* Message Box */}
          <MessageBox source="no" />

          {/* Share */}
          <ShareQr />
        </div>
      </div>
    </VisitorGate>
  );
};

export default NoPage;
