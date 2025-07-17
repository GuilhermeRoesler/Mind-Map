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
import HeaderPanel from './HeaderPanel';

const nodeTypes = {
    interactive: InteractiveNode,
}

function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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

    // carrega dados do localStorage
    useEffect(() => {
        const storedNodes = localStorage.getItem('nodes');
        const storedEdges = localStorage.getItem('edges');

        if (storedNodes) {
            setNodes(JSON.parse(storedNodes));
        }
        if (storedEdges) {
            setEdges(JSON.parse(storedEdges));
        }
    }, [])

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
            <HeaderPanel />
        </ReactFlowProvider>
    );
}

export default Flow;
