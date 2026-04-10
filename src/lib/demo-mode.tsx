"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type DemoMode = "populated" | "empty";

interface DemoModeContextValue {
  mode: DemoMode;
  toggle: () => void;
  isEmpty: boolean;
}

const DemoModeContext = createContext<DemoModeContextValue>({
  mode: "populated",
  toggle: () => {},
  isEmpty: false,
});

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DemoMode>("populated");
  const toggle = useCallback(() => setMode((m) => (m === "populated" ? "empty" : "populated")), []);
  return (
    <DemoModeContext.Provider value={{ mode, toggle, isEmpty: mode === "empty" }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
