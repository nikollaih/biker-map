import { useRef } from "react";

export function useLongPress(onLongPress, delay = 600) {
    const timerRef = useRef(null);

    const start = (lat, lng) => {
        timerRef.current = setTimeout(() => onLongPress(lat, lng), delay);
    };

    const cancel = () => clearTimeout(timerRef.current);

    return { start, cancel };
}
