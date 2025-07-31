// src/hooks/useAddNode.ts

import { useReactFlow } from '@xyflow/react';
import { useLayoutNodes } from './useLayoutNodes';
import { ulid } from 'ulid';
import { getConnectionColor } from '../utils/colorUtils';

const useNodeHandler = () => {
    const { getNode, getNodes, setNodes, getEdges, setEdges } = useReactFlow();
    const { layoutNodes } = useLayoutNodes();

    const createAdjacentNode = (id: string, direction: 'left' | 'right' = 'right') => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const offset = 50; // Distância entre os nodes
        const newPosition = {
            x: currentNode.position.x + (direction === 'right'
                ? offset + (currentNode.measured?.width || 0)
                : -offset - 98),
            y: (currentNode.measured?.height || 0) / 2 + currentNode.position.y - 16.5
        };

        const newNodeId = ulid();
        const newNode = {
            id: newNodeId,
            data: {
                label: `Type something`,
                parentId: id,
                // side: type
            },
            position: newPosition,
            type: 'interactive',
            style: {
                border: 'none',
            }
        };

        const currentEdges = getEdges();
        const childIndex = currentEdges.filter(edge => {
            const expectedHandle = direction === 'right' ? 'left-target' : 'right-target';
            return edge.source === id && edge.targetHandle === expectedHandle;
        }).length;
        const connectionColor = getConnectionColor(childIndex);

        const newEdge = {
            id: `edge-${id}-${newNodeId}`,
            source: id,
            target: newNodeId,
            sourceHandle: direction === 'right' ? 'right' : 'left',
            targetHandle: direction === 'right' ? 'left-target' : 'right-target',
            type: 'default',
            style: {
                stroke: connectionColor,
            },
            data: {
                color: connectionColor,
                childIndex: childIndex
            }
        };

        setNodes((nodes) => [...nodes, newNode]);
        setEdges((edges) => [...edges, newEdge]);

        // layout
        setTimeout(() => {
            layoutNodes();

            // focus
            const newNodeElement = document.getElementById(newNodeId);
            if (newNodeElement)
                newNodeElement.focus();
        }, 100);

    };

    const createSiblingNode = (id: string) => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const parentId = currentNode.data.parentId as string;
        createAdjacentNode(parentId);
    }

    const deleteNode = (id: string) => {
        const edges = getEdges().filter(edge => edge.source !== id && edge.target !== id);
        setEdges(edges);

        const nodes = getNodes().filter(node => node.id !== id);
        setNodes(nodes);
        setTimeout(() => {
            layoutNodes();
        }, 100);
    }

    return { createAdjacentNode, createSiblingNode, deleteNode };
};

export default useNodeHandler;