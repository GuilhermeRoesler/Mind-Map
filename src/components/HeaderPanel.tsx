import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { useHeaderActions } from '../hooks/useHeaderActions';
// import HeaderMenu from './HeaderMenu';

const HeaderPanel = () => {
    const { handleHome, handleLayoutNodes, handleExport, handleImport } = useHeaderActions();
    const [showMenu, setShowMenu] = useState(false);;

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    return (
        <Panel position="top-left" className='HeaderPanel toolbar'>
            <h1 onClick={handleHome}>MindMap<span>Home</span></h1>
            <i className="fa-solid fa-ellipsis-vertical" onClick={toggleMenu}><span>Main menu</span>
                {showMenu && (
                    <div className="menu">
                        <p onClick={() => handleLayoutNodes()}>Layout Nodes</p>
                    </div>
                )}
            </i>
            <i className="fa-solid fa-download" onClick={handleExport}><span>Exportar</span></i>
            <i className="fa-solid fa-upload" onClick={handleImport}><span>Importar</span></i>
        </Panel>
    )
}

export default HeaderPanel