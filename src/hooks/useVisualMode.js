import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prev) => [...prev.slice(0, -1), mode]);
    } else {
      setHistory((prev) => [...prev, newMode]);
    }

    setMode(newMode);
  }
  function back() {
    setHistory((prev) => {
      if (prev.length === 1) {
        return [...prev];
      }

      const reducedMode = [...prev.slice(0, -1)];
      setMode(reducedMode[reducedMode.length - 1]);

      return reducedMode;
    });
  }
  return { mode, transition, back };
};