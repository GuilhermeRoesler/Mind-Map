import React, { use } from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import { useHeaderActions } from '../hooks/useHeaderActions';

const HeaderPanel = () => {
    const { handleHome, handleMenu, handleExport, handleImport } = useHeaderActions();

    return (
        <Panel position="top-left" className='HeaderPanel toolbar'>
            <h1 onClick={handleHome}>MindMap<span>Home</span></h1>
            <i className="fa-solid fa-ellipsis-vertical" onClick={handleMenu}><span>Main menu</span></i>
            <i className="fa-solid fa-download" onClick={handleExport}><span>Exportar</span></i>
            <i className="fa-solid fa-upload" onClick={handleImport}><span>Importar</span></i>
        </Panel>
    )
}

export default HeaderPanel