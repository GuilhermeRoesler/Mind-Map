import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { useHeaderActions } from '../hooks/useHeaderActions';
import SettingsModal from './SettingsModal';
// import HeaderMenu from './HeaderMenu';

const HeaderPanel = () => {
    const { handleHome, handleLayoutNodes, handleExport, handleImport } = useHeaderActions();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const applyColorize = () => { }

    return (
        <Panel position="top-left" className='HeaderPanel toolbar'>
            <span onClick={handleHome} title='Home'>MindMap</span>
            <span className="material-symbols-outlined" title="Download" onClick={handleExport}>download</span>
            <span className="material-symbols-outlined" title="Upload" onClick={handleImport}>upload</span>
            <span className="material-symbols-outlined" title="More" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>more_vert
                {isSettingsOpen && (
                    <div className="more-container">
                        <div className="more-item" title="Adjust Layers" onClick={handleLayoutNodes}>
                            <span className="material-symbols-outlined">stacks</span>
                            <p>Adjust layout</p>
                        </div>
                        <div className="more-item" title="Colorize" onClick={applyColorize}>
                            <span className="material-symbols-outlined">palette</span>
                            <p>Colorize</p>
                        </div>
                        <div className="more-item" title="Settings" onClick={() => setIsDialogOpen(true)}>
                            <span className="material-symbols-outlined">settings</span>
                            <p>Settings</p>
                        </div>
                    </div>
                )}
            </span>
            {isDialogOpen && <SettingsModal isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />}
        </Panel>
    )
}

export default HeaderPanel