import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { SpeechBubble } from "./SpeechBubble";
import { useTheme } from "next-themes";

import { MascotSvg } from "./MascotSvg";
export function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [expression, setExpression] = useState<
    "greet" | "normal" | "blink" | "happy" | "goodbye"
  >("greet");
  const [speechText, setSpeechText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const timeSpawn = 600000;

  useEffect(() => {
    // Global timer to show the mascot
    const timer = setTimeout(() => {
      setIsVisible(true);
      setExpression("greet");
      setSpeechText("Hello, I think you like this portfolio!");

      // T=5s
      setTimeout(() => {
        setExpression("normal");
        setSpeechText("Are you looking for a backend engineer?");
      }, 5000);

      // T=10s
      setTimeout(() => {
        setExpression("blink");
        setTimeout(() => {
          setExpression("happy");
          setSpeechText("I highly recommend trying my Cover Letter Generator!");
        }, 300); // 300ms blink
      }, 10000);

      // T=12s
      setTimeout(() => {
        // Keep showing button in normal/blink loops
        setShowButton(true);
      }, 12000);
    }, timeSpawn);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowButton(false);
    setSpeechText("See you!");
    setExpression("goodbye");
    setTimeout(() => {
      setIsVisible(false);
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
          className="fixed -bottom-4 md:-bottom-2 right-0 md:right-12 z-[100] w-[130px] h-[190px] md:w-[190px] md:h-[250px] pointer-events-none"
        >
          <div className="relative w-full h-full pointer-events-auto">
            <SpeechBubble
              text={speechText}
              showButton={showButton}
              onClose={handleClose}
            />

            <motion.div animate={expression} className="w-full h-full">
              <MascotSvg isDark={isDark} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
