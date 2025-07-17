import React, { useEffect, useCallback } from 'react';
import { useTextSelection } from '../hooks/useTextSelection';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { useNodeEditor } from '../hooks/useNodeEditor';

interface InteractiveNodeContentProps {
    id: string;
    data: { label: string };
}

const InteractiveNodeContent: React.FC<InteractiveNodeContentProps> = ({ id, data }) => {
    const { isEditing, contentRef, startEditing, saveEdit, cancelEdit } = useNodeEditor({
        id,
        initialLabel: data.label
    });

    const {
        selectAllText,
        preserveSelection,
        setCursorPosition,
        preserveSelectionWithDelay,
        clearSelectionTimeout
    } = useTextSelection();

    const {
        startTracking,
        updateTracking,
        stopTracking,
        isCurrentlySelecting,
        hasMouseMoved
    } = useMouseTracking();

    // Auto-focus e seleção quando entra em modo de edição
    useEffect(() => {
        if (isEditing && contentRef.current) {
            contentRef.current.focus();
            selectAllText(contentRef.current);
        }
    }, [isEditing, selectAllText]);

    // Cleanup na desmontagem
    useEffect(() => {
        return () => {
            clearSelectionTimeout();
        };
    }, [clearSelectionTimeout]);

    // Event Handlers
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditing) {
            startEditing();
        } else if (contentRef.current) {
            selectAllText(contentRef.current);
        }
    }, [isEditing, startEditing, selectAllText]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    }, [saveEdit, cancelEdit]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            if (!isCurrentlySelecting()) {
                saveEdit();
            }
        }, 100);
    }, [saveEdit, isCurrentlySelecting]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isEditing) return;

        e.stopPropagation();

        // Clique simples - posiciona cursor
        const trackingResult = stopTracking();
        if (trackingResult.startPosition &&
            !hasMouseMoved(trackingResult.startPosition, { x: e.clientX, y: e.clientY })) {
            setCursorPosition(e.clientX, e.clientY);
        }
    }, [isEditing, stopTracking, hasMouseMoved, setCursorPosition]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isEditing) return;

        e.stopPropagation();
        startTracking(e.clientX, e.clientY);
        clearSelectionTimeout();
    }, [isEditing, startTracking, clearSelectionTimeout]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isEditing || !isCurrentlySelecting()) return;

        e.stopPropagation();
        updateTracking(e.clientX, e.clientY);
    }, [isEditing, isCurrentlySelecting, updateTracking]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (!isEditing) return;

        e.stopPropagation();

        const trackingResult = stopTracking();
        if (trackingResult.hadMovement) {
            const currentSelection = preserveSelection();
            if (currentSelection) {
                preserveSelectionWithDelay(currentSelection);
            }
        }
    }, [isEditing, stopTracking, preserveSelection, preserveSelectionWithDelay]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, pastedText);
    }, []);

    return (
        <div className="node-content">
            <p
                ref={contentRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                spellCheck={false}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onDoubleClick={handleDoubleClick}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onPaste={handlePaste}
                className={`node-label ${isEditing ? 'nodrag' : ''}`}
            >
                {/* {data.label} */}
                {id}
            </p>
        </div>
    );
};

export default InteractiveNodeContent;
