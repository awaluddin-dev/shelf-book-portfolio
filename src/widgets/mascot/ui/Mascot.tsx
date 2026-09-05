import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { SpeechBubble } from "./SpeechBubble";
import { useTheme } from "next-themes";

import { MascotSvg } from "./MascotSvg";
import { ChatSvg } from "./ChatSvg";
import { ChatFloatingMenu } from "./ChatFloatingMenu";

export function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [expression, setExpression] = useState<
    "greet" | "normal" | "blink" | "happy" | "goodbye"
  >("greet");
  const [speechText, setSpeechText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const timeSpawn = Number(process.env.MASCOT_TIME_SPAWN) || 45000;

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [
      // Global timer to show the mascot
      setTimeout(() => {
        setIsVisible(true);
        setExpression("greet");
        setSpeechText("Hello, I think you like this portfolio!");
      }, timeSpawn),

      // T=5s
      setTimeout(() => {
        setExpression("normal");
        setSpeechText("Are you looking for a backend engineer?");
      }, timeSpawn + 5000),

      // T=10s
      setTimeout(() => {
        setExpression("blink");
      }, timeSpawn + 10000),

      setTimeout(() => {
        setExpression("happy");
        setSpeechText("I highly recommend trying my Cover Letter Generator!");
      }, timeSpawn + 10300), // 10s + 300ms blink

      // T=12s
      setTimeout(() => {
        // Keep showing button in normal/blink loops
        setShowButton(true);
      }, timeSpawn + 12000),

      // T=20s (10 seconds after happy state)
      setTimeout(() => {
        setIsChatMode(true);
      }, timeSpawn + 20300),
    ];

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [timeSpawn]);

  const handleClose = () => {
    setShowButton(false);
    setSpeechText("See you!");
    setExpression("goodbye");
    setTimeout(() => {
      setIsChatMode(true);
    }, 2000);
  };

  // Framer Motion Variants
  const mascotVariants: Variants = {
    hidden: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Right Eye Normal (MataKanan)

  // Left Eye Normal (MataKanan_2)

  // Right Eye Happy (MataKananHappy)

  // Left Eye Happy (MataKiriHappy)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={mascotVariants}
          className={`fixed z-[100] pointer-events-none transition-all duration-700 ease-in-out ${
            isChatMode
              ? "bottom-6 right-6 w-16 h-16 md:w-20 md:h-20"
              : "-bottom-4 md:-bottom-2 right-0 md:right-12 w-[130px] h-[190px] md:w-[190px] md:h-[250px]"
          }`}
        >
          <div className="relative w-full h-full pointer-events-auto">
            {isChatMode ? (
              <div className="relative w-full h-full flex items-center justify-center group">
                <ChatFloatingMenu
                  isOpen={isMenuOpen}
                  onClose={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <ChatSvg
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    isDark={isDark}
                  />
                </motion.div>
              </div>
            ) : (
              <>
                <SpeechBubble
                  text={speechText}
                  showButton={showButton}
                  onClose={handleClose}
                />

                <motion.div animate={expression} className="w-full h-full">
                  <MascotSvg isDark={isDark} />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
