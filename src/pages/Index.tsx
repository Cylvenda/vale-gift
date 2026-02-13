import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import DecisionButtons from "@/components/DecisionButtons";
import MusicToggle from "@/components/MusicToggle";
import EasterEgg from "@/components/EasterEgg";
import VisitorGate from "@/components/VisitorGate";

const Index = () => {
  return (
    <VisitorGate>
      <div className="relative min-h-screen romantic-gradient flex flex-col items-center justify-center px-6 py-12">
        <AnimatedBackground />
        <MusicToggle />
        <EasterEgg />

        <motion.div
          className="relative z-10 text-center max-w-lg mx-auto space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Heartbeat icon */}
          <motion.div
            className="text-7xl mx-auto"
            animate={{ scale: [1, 1.25, 1, 1.25, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          >
            💖
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-romantic leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Will you be my Valentine?
          </motion.h1>

          {/* Subline */}
          <motion.p
            className="font-body text-lg sm:text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            I made this little app just for you. 💕
          </motion.p>

          {/* Buttons */}
          <DecisionButtons />
        </motion.div>
      </div>
    </VisitorGate>
  );
};

export default Index;
