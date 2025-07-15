import { useRef, useCallback } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

export const useMouseTracking = (threshold: number = 3) => {
    const mouseDownPosRef = useRef<MousePosition | null>(null);
    const isSelectingRef = useRef(false);
    const hasTextSelectionRef = useRef(false);

    const hasMouseMoved = useCallback((startPos: MousePosition, endPos: MousePosition) => {
        return Math.abs(endPos.x - startPos.x) > threshold ||
            Math.abs(endPos.y - startPos.y) > threshold;
    }, [threshold]);

    const startTracking = useCallback((x: number, y: number) => {
        mouseDownPosRef.current = { x, y };
        isSelectingRef.current = true;
        hasTextSelectionRef.current = false;
    }, []);

    const updateTracking = useCallback((x: number, y: number) => {
        if (mouseDownPosRef.current && hasMouseMoved(mouseDownPosRef.current, { x, y })) {
            hasTextSelectionRef.current = true;
        }
    }, [hasMouseMoved]);

    const stopTracking = useCallback(() => {
        isSelectingRef.current = false;
        return {
            hadMovement: hasTextSelectionRef.current,
            startPosition: mouseDownPosRef.current
        };
    }, []);

    const isCurrentlySelecting = useCallback(() => isSelectingRef.current, []);

    return {
        startTracking,
        updateTracking,
        stopTracking,
        isCurrentlySelecting,
        hasMouseMoved
    };
};
