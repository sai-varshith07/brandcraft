import { useState, useCallback } from "react";

let toastTimer;

export function useToast() {
  const [msg, setMsg] = useState("");
  const show = useCallback((m) => {
    setMsg(m);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setMsg(""), 2500);
  }, []);
  return { msg, show };
}
