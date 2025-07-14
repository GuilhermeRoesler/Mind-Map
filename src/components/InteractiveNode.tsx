import { memo } from 'react';
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
        </div>
    );
}

export default memo(InteractiveNode);
