import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ShareQr = () => {
  const url = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied! 💕", description: "Share the love." });
    } catch {
      toast({ title: "Couldn't copy", description: "Please copy manually.", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 sm:p-8 text-center space-y-4"
    >
      <h3 className="font-display text-xl text-foreground">Share This Moment 💕</h3>
      <div className="inline-block p-4 bg-foreground/90 rounded-2xl">
        <QRCodeSVG
          value={url}
          size={160}
          bgColor="transparent"
          fgColor="hsl(340, 30%, 8%)"
          level="M"
        />
      </div>
      <motion.button
        onClick={handleCopy}
        className="block mx-auto px-6 py-3 rounded-xl font-body font-semibold
          glass-card border-valentine-rose/30 text-foreground
          hover:bg-valentine-rose/10 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        Copy Link 🔗
      </motion.button>
    </motion.div>
  );
};

export default ShareQr;
