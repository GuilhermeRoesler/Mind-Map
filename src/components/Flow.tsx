import { useCallback, useState, useRef, useEffect } from 'react';
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    type Connection,
    type ReactFlowInstance

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { initialNodes } from '../data/nodes';
import { initialEdges } from '../data/edges';

import InteractiveNode from './InteractiveNode';

const nodeTypes = {
    interactive: InteractiveNode,
}

function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [nodeId, setNodeId] = useState(4);
    const isDragging = useRef(false);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    // Função para criar um novo nó
    const createNode = useCallback((position: { x: number; y: number }) => {
        const newNode = {
            id: nodeId.toString(),
            data: { label: `Node ${nodeId}` },
            position,
            type: 'interactive'
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeId((id) => id + 1);
    }, [nodeId]);

    return (
        <ReactFlowProvider>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                fitView
            />
            <Controls />
            <Background
                variant={BackgroundVariant.Lines}
                bgColor='#f2f2f2'
                lineWidth={1} color='#e6e6e6'
                gap={40} />
        </ReactFlowProvider>
    );
}

export default Flow;
