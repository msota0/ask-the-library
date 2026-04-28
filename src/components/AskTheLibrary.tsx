import { useMemo, useState, useEffect } from "react";import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

type ResponseType = {
  text: string;
  helper: string;
};


const RESPONSES: ResponseType[] = [
  // --- Grounded encouragement ---
  { 
    text: "Take a deep breath. You are doing better than you think.", 
    helper: "Start with one small thing." 
  },
  { 
    text: "Lock in. You are closer than it feels.", 
    helper: "Just keep moving forward." 
  },
  { 
    text: "You don’t need to solve everything right now.", 
    helper: "Do the next step." 
  },
  { 
    text: "It feels overwhelming because it matters.", 
    helper: "That’s not a bad thing." 
  },
  { 
    text: "You’ve handled harder days than this.", 
    helper: "You can handle this one too." 
  },
  { 
    text: "Pause. Breathe. Then begin again.", 
    helper: "You’re allowed to reset." 
  },
  { 
    text: "Progress counts, even if it’s slow.", 
    helper: "Keep going." 
  },
  { 
    text: "You are not behind. You are in the process.", 
    helper: "Stay with it." 
  },
  { 
    text: "Finish one thing. Then the next.", 
    helper: "Momentum builds quietly." 
  },
  { 
    text: "You’ve come too far to doubt yourself now.", 
    helper: "Trust your work." 
  },
  { 
    text: "This moment will pass. Your effort stays.", 
    helper: "Keep showing up." 
  },

  // --- Library / whimsical encouragement ---
  { 
    text: "The library believes in your ability to finish this.", 
    helper: "Find your spot and begin." 
  },
  { 
    text: "The quiet floors have seen worse weeks.", 
    helper: "You’re going to get through this one." 
  },
  { 
    text: "Somewhere in this building, focus is happening. You can join it.", 
    helper: "Pick a seat and start." 
  },
  { 
    text: "The stacks are not in a rush. Neither are you.", 
    helper: "Steady is enough." 
  },
  { 
    text: "The answer might not be obvious, but it is findable.", 
    helper: "Try one search." 
  },
  { 
    text: "There is a version of you finishing this. Stay with them.", 
    helper: "You’re already on the way." 
  },
  { 
    text: "The library has seen all-nighters, breakdowns, and breakthroughs.", 
    helper: "Yours is just another story in progress." 
  },
  { 
    text: "You don’t need perfect conditions. Just a place to begin.", 
    helper: "This is enough." 
  },
  { 
    text: "Focus is not loud. It builds quietly.", 
    helper: "Give it a few minutes." 
  },
  { 
    text: "The work feels heavy because you’re carrying it seriously.", 
    helper: "That’s a strength." 
  },
  { 
    text: "Even a small session here counts.", 
    helper: "Show up for it." 
  },
];

const SUBTITLES = [
  "You’re doing more than you think.",
  "Take a breath. You’re still in it.",
  "A small reminder for a long week.",
  "You don’t have to figure everything out at once.",
  "The work is happening, even if it feels slow.",
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
  const subtitle = "A small reminder for a long week.";
  useEffect(() => {
  if (!response) return;

  const timer = setTimeout(() => {
    setResponse(null);
  }, 20000); // 30 seconds

  return () => clearTimeout(timer);
}, [response]);

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
        <h1 className="title">Tap for good vibes</h1>
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
                }
              : {
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: isConsulting ? 1.6 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* 👇 NEW: text inside orb */}
          <div className="orb-content">
            {!isConsulting && response && (
              <span className="orb-text">{response.helper}</span>
            )}

            {!isConsulting && !response && (
              <span className="orb-text">Tap for good vibes</span>
            )}
          </div>

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
                {/* <p className="response-helper">{response.helper}</p> */}
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
        {/* 
        <button className="button" onClick={handleAsk} disabled={isConsulting}>
          {response ? "Ask Again" : "Consult"}
        </button>
        */}
      </div>
    </div>
  );
}