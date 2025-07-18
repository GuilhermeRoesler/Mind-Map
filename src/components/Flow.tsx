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
import { useConnectionColors } from '../hooks/useConnectionColors';

import InteractiveNode from './InteractiveNode';
import HeaderPanel from './HeaderPanel';

const nodeTypes = {
    interactive: InteractiveNode,
}

function FlowContent() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const { updateConnectionColors } = useConnectionColors();

    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nds) => {
                const updatedNodes = applyNodeChanges(changes, nds);
                localStorage.setItem('nodes', JSON.stringify(updatedNodes));
                return updatedNodes;
            })
        },
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => {
            setEdges((eds) => {
                const updatedEdges = applyEdgeChanges(changes, eds)
                localStorage.setItem('edges', JSON.stringify(updatedEdges));
                return updatedEdges;
            })
        },
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => {
                const updatedEdges = addEdge(connection, eds);
                localStorage.setItem('edges', JSON.stringify(updatedEdges));
                return updatedEdges;
            })
        },
        []
    );

    // Carrega dados do localStorage
    useEffect(() => {
        const storedNodes = localStorage.getItem('nodes');
        const storedEdges = localStorage.getItem('edges');

        if (storedNodes) {
            setNodes(JSON.parse(storedNodes));
        }
        if (storedEdges) {
            setEdges(JSON.parse(storedEdges));
        }
    }, []);

    // Atualiza cores das conexões quando edges mudam
    useEffect(() => {
        if (edges.length > 0) {
            updateConnectionColors();
        }
    }, [edges.length, updateConnectionColors]);

    return (
        <>
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
        </>
    );
}

function Flow() {
    return (
        <ReactFlowProvider>
            <FlowContent />
        </ReactFlowProvider>
    )
}

export default Flow;
