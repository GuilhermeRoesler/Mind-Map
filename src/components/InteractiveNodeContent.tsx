import React, { useState, useRef, useEffect } from 'react'
import { useReactFlow } from '@xyflow/react';

const InteractiveNodeContent = ({ id, data }: { id: string, data: { label: string } }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label);
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const { setNodes } = useReactFlow();

    // Foca no input quando entra em modo de edição
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Handler para duplo clique
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }

    // Handler para salvar a edição
    const handleSave = () => {
        if (editValue.trim() !== '') {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === id
                        ? { ...node, data: { ...node.data, label: editValue.trim() } }
                        : node
                )
            );
        }
        setIsEditing(false);
    }

    // Handler para cancelar a edição
    const handleCancel = () => {
        setEditValue(data.label);
        setIsEditing(false);
    }

    // Handler para teclas pressionadas no input
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    }

    // Handler para quando o input perde o foco
    const handleBlur = () => {
        handleSave();
    }

    const adjustInputWidth = () => {
        if (inputRef.current && measureRef.current) {
            measureRef.current.textContent = editValue || 'A';
            const width = Math.max(measureRef.current.offsetWidth + 20, 60);
            inputRef.current.style.width = `${Math.min(width, 280)}px`;
        }
    }

    useEffect(() => {
        if (isEditing) {
            adjustInputWidth();
        }
    }, [editValue, isEditing]);

    return (
        <div className='node-content' onDoubleClick={handleDoubleClick}>
            {isEditing ? (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        className='edit-input'
                    />
                    {/* Elemento invisível para medir o texto */}
                    <span ref={measureRef} />
                </>
            ) : (
                <>
                    {data.label}
                </>
            )}
        </div>
    )
}

export default InteractiveNodeContent