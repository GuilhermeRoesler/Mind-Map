import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import AddButton from './AddButton';
import InteractiveNodeContent from './InteractiveNodeContent';

interface InteractiveNodeData {
    label: string;
    side: 'right' | 'left';
}

const LoadAddButtons = ({ id, data }: { id: string, data: { side: 'right' | 'left' } }) => {
    if (id === 'root') return (
        <>
            <AddButton type="left" id={id} />
            <AddButton type="right" id={id} />
        </>
    )
    return <AddButton type={data.side} id={id} />
}

function InteractiveNode({ id, data }: { id: string, data: InteractiveNodeData }) {
    return (
        <div className="interactive-node">
            <LoadAddButtons id={id} data={data} />
            <InteractiveNodeContent id={id} data={data} />
            <Handle type="source" position={Position.Left} id={"left"} />
            <Handle type="target" position={Position.Left} id={"left-target"} />
            <Handle type="source" position={Position.Right} id={"right"} />
            <Handle type="target" position={Position.Right} id={"right-target"} />
        </div>
    );
}

export default memo(InteractiveNode);
