import { useReactFlow } from '@xyflow/react';
import { ulid } from 'ulid';

const AddButton = ({ type, id }: { type: 'left' | 'right'; id: string }) => {
    const { getNode, setNodes, setEdges } = useReactFlow();

    const createAdjacentNode = (direction: 'left' | 'right') => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const offset = 50; // Distância entre os nodes
        const newPosition = {
            x: currentNode.position.x + (direction === 'right' ? offset + (currentNode.measured?.width || 0) : -offset - 98),
            y: (currentNode.measured?.height || 0) / 2 + currentNode.position.y - 16.5
        };

        const newNodeId = ulid();
        const newNode = {
            id: newNodeId,
            data: { label: `Type something` },
            position: newPosition,
            type: 'interactive'
        };

        const newEdge = {
            id: `edge-${id}-${newNodeId}`,
            source: id,
            target: newNodeId,
            sourceHandle: direction === 'right' ? 'right' : 'left',
            targetHandle: direction === 'right' ? 'left-target' : 'right-target',
            type: 'default'
        };

        setNodes((nodes) => [...nodes, newNode]);
        setEdges((edges) => [...edges, newEdge]);
    };

    return (
        <button
            className={`add-button add-button-${type}`}
            onClick={(e) => {
                e.stopPropagation();
                createAdjacentNode(type);
            }}
        >
            <i className="fa-solid fa-plus"></i>
        </button>
    )
}

export default AddButton