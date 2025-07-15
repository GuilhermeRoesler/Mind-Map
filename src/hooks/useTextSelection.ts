import { useRef, useCallback } from 'react';

export const useTextSelection = () => {
    const selectionTimeoutRef = useRef<number | null>(null);

    const selectAllText = useCallback((element: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }, []);

    const preserveSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                return range.cloneRange();
            }
        }
        return null;
    }, []);

    const restoreSelection = useCallback((range: Range) => {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, []);

    const setCursorPosition = useCallback((x: number, y: number) => {
        const range = document.createRange();
        const selection = window.getSelection();
        const caretPos = document.caretPositionFromPoint(x, y);

        if (caretPos) {
            range.setStart(caretPos.offsetNode, caretPos.offset);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    }, []);

    const preserveSelectionWithDelay = useCallback((range: Range | null, delay: number = 50) => {
        if (range) {
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current);
            }

            selectionTimeoutRef.current = setTimeout(() => {
                restoreSelection(range);
            }, delay);
        }
    }, [restoreSelection]);

    const clearSelectionTimeout = useCallback(() => {
        if (selectionTimeoutRef.current) {
            clearTimeout(selectionTimeoutRef.current);
        }
    }, []);

    return {
        selectAllText,
        preserveSelection,
        restoreSelection,
        setCursorPosition,
        preserveSelectionWithDelay,
        clearSelectionTimeout
    };
};
