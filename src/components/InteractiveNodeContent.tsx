import React, { useState, useRef, useEffect } from 'react'
import { useReactFlow } from '@xyflow/react';

const InteractiveNodeContent = ({ id, data }: { id: string, data: { label: string } }) => {
    const [isEditing, setIsEditing] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);
    const { setNodes } = useReactFlow();
    const isSelectingRef = useRef(false);
    const selectionTimeoutRef = useRef<number | null>(null);
    const mouseDownPosRef = useRef<{ x: number, y: number } | null>(null);
    const hasTextSelectionRef = useRef(false);

    // Seleciona todo o texto
    const selectNodeText = () => {
        const range = document.createRange();
        if (contentRef.current)
            range.selectNodeContents(contentRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    // Preserva a seleção atual
    const preserveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed)
                return range.cloneRange();
        }
        return null;
    }

    // Restaura a seleção
    const restoreSelection = (range: Range) => {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const hasMouseMoved = (startPos: { x: number, y: number }, endPos: { x: number, y: number }) => {
        const threshold = 3
        return Math.abs(endPos.x - startPos.x) > threshold || Math.abs(endPos.y - startPos.y) > threshold;
    }

    // Foca no elemento quando entra em modo de edição
    useEffect(() => {
        if (isEditing && contentRef.current) {
            contentRef.current.focus();
            selectNodeText();
        }
    }, [isEditing]);

    // Handler para duplo clique
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditing) {
            setIsEditing(true);
        } else {
            selectNodeText();
        }
    }

    // Handler para salvar a edição
    const handleSave = () => {
        const newValue = contentRef.current?.textContent || '';
        if (newValue.trim() !== '') {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id
                        ? { ...node, data: { ...node.data, label: newValue.trim() } }
                        : node
                )
            );
        }
        setIsEditing(false);
    }

    // Handler para cancelar a edição
    const handleCancel = () => {
        if (contentRef.current)
            contentRef.current.textContent = data.label;
        setIsEditing(false);
    }

    // Handler para teclas pressionadas no input
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    }

    // Handler para quando o input perde o foco
    const handleBlur = () => {
        // Delay para permitir que a seleção seja preservada
        setTimeout(() => {
            if (!isSelectingRef.current) {
                handleSave();
            }
        }, 100);
    }

    // Handler para quando o input é clicado
    const handleClick = (e: React.MouseEvent) => {
        if (isEditing) {
            e.stopPropagation();

            // Se não houve movimento do mouse, é um clique simples
            if (mouseDownPosRef.current && !hasMouseMoved(mouseDownPosRef.current, { x: e.clientX, y: e.clientY })) {
                const range = document.createRange();
                const selection = window.getSelection();

                const caretPos = document.caretPositionFromPoint(e.clientX, e.clientY);
                if (caretPos) {
                    range.setStart(caretPos.offsetNode, caretPos.offset);
                    range.collapse(true);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            }
        }
    }

    // Handler para mousedown - inicia o processo de seleção
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditing) {
            e.stopPropagation();
            isSelectingRef.current = true;
            mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
            hasTextSelectionRef.current = false;

            // Limpa timeout anterior se existir
            if (selectionTimeoutRef.current)
                clearTimeout(selectionTimeoutRef.current);
        }
    }

    // Handler para mousemove - durante a seleção
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isEditing && isSelectingRef.current) {
            e.stopPropagation();

            // Se o mouse se moveu, marca que pode haver seleção de texto
            if (mouseDownPosRef.current && hasMouseMoved(mouseDownPosRef.current, { x: e.clientX, y: e.clientY }))
                hasTextSelectionRef.current = true;
        }
    }

    // Handler para mouseup - finaliza a seleção
    const handleMouseUp = (e: React.MouseEvent) => {
        if (isEditing) {
            e.stopPropagation();

            // Só preserva a seleção se houve movimento do mouse E há texto selecionado
            if (hasTextSelectionRef.current) {
                const currentSelection = preserveSelection();

                if (currentSelection) {
                    // Define um timeout para restaurar a seleção caso ela seja perdida
                    selectionTimeoutRef.current = setTimeout(() => {
                        if (currentSelection && contentRef.current)
                            restoreSelection(currentSelection);
                        isSelectingRef.current = false;
                    }, 50);
                } else isSelectingRef.current = false;
            } else isSelectingRef.current = false;
        }
    }

    // Cleanup do timeout quando o componente for desmontado
    useEffect(() => {
        return () => {
            if (selectionTimeoutRef.current)
                clearTimeout(selectionTimeoutRef.current);
        };
    }, []);

    // Handler para colar somente texto sem formatação
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, pastedText);
    }

    return (
        <div className='node-content'>
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
                className={`node-label${isEditing ? ' nodrag' : ''}`}
            >
                {data.label}
            </p>
        </div>
    )
}

export default InteractiveNodeContent