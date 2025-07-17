import { useReactFlow } from '@xyflow/react';
import { ulid } from 'ulid';

const AddButton = ({ type, id }: { type: 'left' | 'right'; id: string }) => {
    const { getNode, setNodes } = useReactFlow();

    const createAdjacentNode = (direction: 'left' | 'right') => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const offset = 50; // Distância entre os nodes
        const newPosition = {
            x: currentNode.position.x + (direction === 'right' ? offset + currentNode.measured?.width : -offset - 98),
            y: (currentNode.measured?.height / 2) + currentNode.position.y - 16.5
        };

        const newNode = {
            id: ulid(),
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