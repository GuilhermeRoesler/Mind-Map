import { useState } from 'react';
import { useLayout, type LayoutType } from '../hooks/useLayout';

const LayoutControls = () => {
    const [selectedLayout, setSelectedLayout] = useState<LayoutType>('tree');
    const [isOpen, setIsOpen] = useState(false);
    const { applyLayout } = useLayout();

    const layouts = [
        { value: 'tree' as LayoutType, label: 'Árvore' },
        { value: 'hierarchical' as LayoutType, label: 'Hierárquico' },
        { value: 'radial' as LayoutType, label: 'Radial' },
    ];

    const handleLayoutChange = (layoutType: LayoutType) => {
        setSelectedLayout(layoutType);
        applyLayout(layoutType);
        setIsOpen(false);
    };

    return (
        <div className="layout-controls">
            <button
                className="layout-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                Layout: {layouts.find(l => l.value === selectedLayout)?.label}
            </button>

            {isOpen && (
                <div className="layout-dropdown">
                    {layouts.map((layout) => (
                        <button
                            key={layout.value}
                            className={`layout-option ${selectedLayout === layout.value ? 'active' : ''}`}
                            onClick={() => handleLayoutChange(layout.value)}
                        >
                            {layout.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LayoutControls;
