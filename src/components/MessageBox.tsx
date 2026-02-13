import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getDeviceInfo, getLocation } from "@/lib/deviceInfo";

interface MessageBoxProps {
  source: "yes" | "no";
}

interface VisitorInfo {
  nickname: string;
  email: string;
}

const getStoredVisitorInfo = (): VisitorInfo | null => {
  const stored = localStorage.getItem('visitorGateInfo');
  return stored ? JSON.parse(stored) : null;
};

const MessageBox = ({ source }: MessageBoxProps) => {
  const visitorInfo = getStoredVisitorInfo();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const canSubmit = message.trim().length > 2 && status === "idle" && visitorInfo;

  const handleSubmit = async () => {
    if (!canSubmit || !visitorInfo) return;
    setStatus("sending");

    try {
      // Get device info and location for the message email
      const deviceInfo = getDeviceInfo();

      // Get location with timeout
      const locationPromise = getLocation();
      const timeoutPromise = new Promise(resolve =>
        setTimeout(() => resolve({ error: 'Location request timeout' }), 5000)
      );
      const locationInfo = await Promise.race([locationPromise, timeoutPromise]);

      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8888/send-email'
        : '/api/send-email';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitorInfo.nickname || "Anonymous",
          email: visitorInfo.email,
          messageA: message,
          messageB: "",
          source,
          deviceInfo,
          locationInfo,
          timestamp: new Date().toISOString(),
          type: 'message_response'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      setStatus("sent");
      toast({ title: "Message sent 💌", description: "Thank you for sharing your heart." });
    } catch (error) {
      console.error('Message send error:', error);
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
        <div className="text-5xl mb-4">💌</div>
        <p className="text-foreground font-display text-xl">Message sent!</p>
        <p className="text-muted-foreground mt-2 font-body">Thank you for sharing your heart with me.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 sm:p-8 space-y-5"
    >
      <h3 className="font-display text-2xl text-foreground text-center">
        Send Me Your Thoughts 💭
      </h3>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5 font-body">
          Your message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Write what's on your heart..."
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 font-body resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {!canSubmit && message.trim().length > 0 && (
        <p className="text-sm text-valentine-rose font-body">Please write at least a few words 💕</p>
      )}

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
        {status === "sending" ? (
          <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            Sending… 💌
          </motion.span>
        ) : (
          "Send My Heart 💌"
        )}
      </motion.button>
    </motion.div>
  );
};

export default MessageBox;
