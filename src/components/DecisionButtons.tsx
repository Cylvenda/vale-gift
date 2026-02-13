import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getDeviceInfo, getLocation, getVisitorInfo } from "@/lib/deviceInfo";

const DecisionButtons = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const navigate = useNavigate();

  const handleChoice = async (answer: "yes" | "no") => {
    setStatus("loading");
    setChoice(answer);

    try {
      // Get visitor info
      const visitorInfo = getVisitorInfo();

      // Get device info
      const deviceInfo = getDeviceInfo();

      // Get location (with timeout)
      const locationPromise = getLocation();
      const timeoutPromise = new Promise(resolve =>
        setTimeout(() => resolve({ error: 'Location request timeout' }), 5000)
      );
      const locationInfo = await Promise.race([locationPromise, timeoutPromise]);

      // Send immediate email
      if (visitorInfo) {
        try {
          const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:8888/send-email'
            : '/api/send-email';

          await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: visitorInfo.nickname || "Anonymous",
              email: visitorInfo.email,
              messageA: `User clicked: ${answer.toUpperCase()}`,
              messageB: '',
              source: answer,
              deviceInfo,
              locationInfo,
              timestamp: new Date().toISOString(),
              type: 'immediate_response'
            }),
          });
        } catch (emailError) {
          console.error('Failed to send immediate email:', emailError);
        }
      }

      // Brief delay for UX, then navigate
      await new Promise((r) => setTimeout(r, 1200));

      setStatus("done");
      navigate(`/${answer}`);
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again 💔",
        variant: "destructive",
      });
      setStatus("idle");
      setChoice(null);
    }
  };

  const isDisabled = status !== "idle";

  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto">
      {status === "loading" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full py-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            💌
          </motion.div>
          <p className="text-foreground/80 font-body text-lg">
            Sending your answer…
          </p>
        </motion.div>
      ) : (
        <>
          <motion.button
            onClick={() => handleChoice("yes")}
            disabled={isDisabled}
            className="flex-1 py-5 px-8 rounded-2xl font-body font-bold text-xl
              bg-gradient-to-br from-valentine-rose to-valentine-pink
              text-primary-foreground
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(340 80% 60% / 0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            YES 💘
          </motion.button>

          <motion.button
            onClick={() => handleChoice("no")}
            disabled={isDisabled}
            className="flex-1 py-5 px-8 rounded-2xl font-body font-bold text-xl
              glass-card text-foreground
              border-valentine-rose/30
              disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          >
            NO 💔
          </motion.button>
        </>
      )}
    </div>
  );
};

export default DecisionButtons;
