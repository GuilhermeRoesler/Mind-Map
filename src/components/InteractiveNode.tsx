import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

import AddButton from './AddButton';

interface InteractiveNodeData {
    label: string;
}

function InteractiveNode({ id, data, selected }: NodeProps<InteractiveNodeData>) {
    return (
        <div className="interactive-node" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <AddButton type="left" id={id} />
            <AddButton type="right" id={id} />
            <div>{data.label}</div>
        </div>
    );
}

export default memo(InteractiveNode);
