import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import AddButton from './AddButton';
import InteractiveNodeContent from './InteractiveNodeContent';
import useNodeHandler from '../hooks/useNodeHandler';

interface InteractiveNodeData {
    label: string;
    side: 'right' | 'left';
}

function InteractiveNode({ id, data }: { id: string, data: InteractiveNodeData }) {
    const { createAdjacentNode, createSiblingNode, deleteNode } = useNodeHandler();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            e.stopPropagation();
            createAdjacentNode(id);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            createSiblingNode(id);
        } else if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            deleteNode(id);
        }
    }

    return (
        <div id={id} className="interactive-node" tabIndex={0} onKeyDown={handleKeyDown}>
            <AddButton type="right" id={id} />
            <InteractiveNodeContent id={id} data={data} />
            <Handle type="source" position={Position.Left} id={"left"} />
            <Handle type="target" position={Position.Left} id={"left-target"} />
            <Handle type="source" position={Position.Right} id={"right"} />
            <Handle type="target" position={Position.Right} id={"right-target"} />
        </div>
    );
}

export default memo(InteractiveNode);
