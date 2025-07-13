import { useReactFlow } from '@xyflow/react';

const AddButton = ({ type, id }: { type: 'left' | 'right'; id: string }) => {
    const { getNode, setNodes } = useReactFlow();

    const createAdjacentNode = (direction: 'left' | 'right') => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const offset = 200; // Distância entre os nodes
        const newPosition = {
            x: currentNode.position.x + (direction === 'right' ? offset : -offset),
            y: currentNode.position.y
        };

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            data: { label: `Type something` },
            position: newPosition,
            type: 'interactive'
        };

        setNodes((nodes) => [...nodes, newNode]);
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