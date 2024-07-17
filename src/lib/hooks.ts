import { RefObject, useEffect, useRef } from "react";

export const useClickAway = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = ["mousedown", "touchstart"]
) => {
  const savedCallback = useRef(onClickAway);

  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  useEffect(() => {
    const handler = (event: E) => {
      const { current: el } = ref;
      el && !el.contains(event.target as Node) && savedCallback.current(event);
    };
    for (const eventName of events) {
      document.addEventListener(eventName, handler as EventListener);
    }
    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler as EventListener);
      }
    };
  }, [events, ref]);
};
