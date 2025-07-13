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
            type: 'interactive' // Mudança aqui para usar o node interativo
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeId((id) => id + 1);
    }, [nodeId]);

    // Handler para clique no canvas
    const onPaneClick = useCallback((event: React.MouseEvent) => {
        // Só cria nó se não estiver arrastando
        if (!isDragging.current && reactFlowInstance) {
            const reactFlowBounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
            console.log(event);
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            createNode(position);
        }
    }, [reactFlowInstance, createNode]);

    // Handler para detectar início do arraste
    const onNodeDragStart = useCallback(() => {
        isDragging.current = true;
    }, []);

    // Handler para detectar fim do arraste
    const onNodeDragStop = useCallback(() => {
        // Pequeno delay para evitar conflito com o clique
        setTimeout(() => {
            isDragging.current = false;
        }, 100);
    }, []);

    // Handler para teclas pressionadas
    const onKeyDown = useCallback((event: KeyboardEvent) => {
        // Cria nó ao pressionar a tecla 'N' ou 'Espaço'
        if (event.code === 'KeyN' || event.code === 'Space') {
            event.preventDefault();

            if (reactFlowInstance) {
                // Cria o nó no centro da viewport
                const centerPosition = reactFlowInstance.screenToFlowPosition({
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                });

                createNode(centerPosition);
            }
        }
    }, [reactFlowInstance, createNode]);

    // Adiciona/remove event listener para teclas
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

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
                onPaneClick={onPaneClick}
                onNodeDragStart={onNodeDragStart}
                onNodeDragStop={onNodeDragStop}
                fitView
            />
            <Controls />
            {/* <MiniMap /> */}
            <Background variant={BackgroundVariant.Lines} bgColor='#f2f2f2' lineWidth={1} color='#e6e6e6' gap={40} />
        </ReactFlowProvider>
    );
}

export default Flow;
