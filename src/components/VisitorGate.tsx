import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface VisitorInfo {
  nickname: string;
  email: string;
}

const getStoredVisitorInfo = (): VisitorInfo | null => {
  const stored = localStorage.getItem('visitorGateInfo');
  return stored ? JSON.parse(stored) : null;
};

const storeVisitorInfo = (info: VisitorInfo) => {
  localStorage.setItem('visitorGateInfo', JSON.stringify(info));
};

interface VisitorGateProps {
  children: React.ReactNode;
}

const VisitorGate = ({ children }: VisitorGateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const stored = getStoredVisitorInfo();
    if (stored) {
      setHasAccess(true);
    } else {
      setIsOpen(true);
    }
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = nickname.trim().length > 1 && isValidEmail(email);

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const info: VisitorInfo = { 
      nickname: nickname.trim(), 
      email: email.trim() 
    };
    storeVisitorInfo(info);
    setIsOpen(false);
    setHasAccess(true);
    toast({ 
      title: "Welcome! 💕", 
      description: `Nice to meet you, ${info.nickname}!` 
    });
  };

  // Show gate modal
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 romantic-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass-card w-full max-w-md p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              <Heart className="w-12 h-12 text-valentine-rose mx-auto fill-valentine-rose" />
            </motion.div>
            <h2 className="font-display text-2xl text-foreground">
              Before We Begin... 💕
            </h2>
            <p className="text-muted-foreground font-body text-sm">
              I'd love to know who you are
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5 font-body">
                Your nickname *
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="What should I call you..."
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 font-body focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1.5 font-body">
                Your email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 font-body focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
              />
              {!isValidEmail(email) && email.length > 0 && (
                <p className="text-sm text-valentine-rose font-body mt-1">
                  Please enter a valid email
                </p>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-4 rounded-xl font-body font-bold text-lg
              bg-gradient-to-r from-valentine-rose to-valentine-pink
              text-primary-foreground
              disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
          >
            Enter 💝
          </motion.button>

          <p className="text-center text-xs text-muted-foreground font-body">
            This helps me remember who visited 💌
          </p>
        </motion.div>
      </div>
    );
  }

  // Show content once access granted
  return (
    <AnimatePresence>
      {hasAccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorGate;
