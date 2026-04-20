import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

type ResponseType = {
  text: string;
  helper: string;
};

const RESPONSES: ResponseType[] = [
  { text: "You’ve opened enough tabs. Close three, then begin.", helper: "A quieter start often works better." },
  { text: "The answer may not be obvious, but it is probably searchable.", helper: "Try a library database before you spiral." },
  { text: "Ask for help sooner than your pride suggests.", helper: "The library does not judge." },
  { text: "Reply hazy. Hydrate first.", helper: "Then try again." },
  { text: "You do not need inspiration. You need a smaller first step.", helper: "Start small." },
  { text: "There is wisdom in the quiet floor today.", helper: "Go there." },
  { text: "The library suspects you already know the answer.", helper: "You just need permission." },
];

const SUBTITLES = [
  "Ask your question. The stacks are listening.",
  "Not everything needs to be figured out alone.",
  "A small oracle for scholarly uncertainty.",
];

const LOADING_LINES = [
  "Summoning a whisper from the shelves…",
  "Listening for a murmur in the margins…",
  "Coaxing a secret from the stacks…",
  "Letting the dust and darkness confer…",
  "The library is considering your fate…",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function AskTheLibrary() {
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [loadingLine, setLoadingLine] = useState("");
  const subtitle = useMemo(() => randomItem(SUBTITLES), []);

  const handleAsk = () => {
    if (isConsulting) return;

    setIsConsulting(true);
    setResponse(null);
    setLoadingLine(randomItem(LOADING_LINES));

    const delay = 2800 + Math.random() * 1200;

    setTimeout(() => {
      setResponse(randomItem(RESPONSES));
      setIsConsulting(false);
    }, delay);
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Ask the Library</h1>
        <p className="subtitle">{subtitle}</p>

        <motion.div
          className={`orb ${isConsulting ? "orb--consulting" : ""}`}
          onClick={handleAsk}
          whileHover={!isConsulting ? { scale: 1.08, y: -4 } : {}}
          whileTap={!isConsulting ? { scale: 0.96 } : {}}
          animate={
            isConsulting
              ? {
                  scale: [1, 1.06, 1],
                  y: [0, -4, 0],
                  filter: [
                    "brightness(1) drop-shadow(0 0 12px rgba(99,102,241,0.25))",
                    "brightness(1.12) drop-shadow(0 0 26px rgba(129,140,248,0.5))",
                    "brightness(1) drop-shadow(0 0 12px rgba(99,102,241,0.25))",
                  ],
                }
              : {
                  y: [0, -6, 0],
                }
          }
          transition={
            isConsulting
              ? {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          {isConsulting && <div className="orb-ripple" />}
        </motion.div>

        <div className="response">
          <AnimatePresence mode="wait">
            {isConsulting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="response-text response-text--loading">{loadingLine}</p>
                <p className="response-helper">Do not rush the old magic.</p>
              </motion.div>
            ) : response ? (
              <motion.div
                key={response.text}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="response-text">“{response.text}”</p>
                <p className="response-helper">{response.helper}</p>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="response-text"
              >
                The answer is waiting.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button className="button" onClick={handleAsk} disabled={isConsulting}>
          {response ? "Ask Again" : "Consult"}
        </button>
      </div>
    </div>
  );
}