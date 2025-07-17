import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import AddButton from './AddButton';
import InteractiveNodeContent from './InteractiveNodeContent';

interface InteractiveNodeData {
    label: string;
}

function InteractiveNode({ id, data, selected }: NodeProps<InteractiveNodeData>) {

    return (
        <div className="interactive-node">
            <AddButton type="left" id={id} />
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
