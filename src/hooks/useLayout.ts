import { useCallback } from 'react';
import { type Node, useReactFlow } from '@xyflow/react';

export type LayoutType = 'hierarchical' | 'radial' | 'force' | 'tree';

interface LayoutConfig {
    nodeSpacing: number;
    levelSpacing: number;
    centerX: number;
    centerY: number;
}

const defaultConfig: LayoutConfig = {
    nodeSpacing: 200,
    levelSpacing: 150,
    centerX: 0,
    centerY: 0,
};

export function useLayout() {
    const { setNodes, getNodes, getEdges } = useReactFlow();

    const applyHierarchicalLayout = useCallback((config: Partial<LayoutConfig> = {}) => {
        const nodes = getNodes();
        const edges = getEdges();
        const finalConfig = { ...defaultConfig, ...config };

        // Encontrar o nó raiz
        const rootNode = nodes.find(node => node.id === 'root') || nodes[0];
        if (!rootNode) return;

        // Construir árvore de dependências
        const nodeMap = new Map<string, Node>();
        const children = new Map<string, string[]>();

        nodes.forEach(node => {
            nodeMap.set(node.id, node);
            children.set(node.id, []);
        });

        edges.forEach(edge => {
            const parentChildren = children.get(edge.source) || [];
            parentChildren.push(edge.target);
            children.set(edge.source, parentChildren);
        });

        // Calcular posições hierárquicas
        const positioned = new Set<string>();
        const updatedNodes: Node[] = [];

        const positionNode = (nodeId: string, level: number, indexInLevel: number, side: 'left' | 'right' | 'center' = 'center') => {
            const node = nodeMap.get(nodeId);
            if (!node || positioned.has(nodeId)) return;

            let x = finalConfig.centerX;
            let y = finalConfig.centerY + (level * finalConfig.levelSpacing);

            if (nodeId === 'root') {
                x = finalConfig.centerX;
                y = finalConfig.centerY;
            } else {
                const sideMultiplier = side === 'left' ? -1 : side === 'right' ? 1 : 0;
                x = finalConfig.centerX + (sideMultiplier * finalConfig.nodeSpacing * (level * 0.5 + 1));

                // Ajustar posição Y baseado no índice
                if (indexInLevel > 0) {
                    y += (indexInLevel - Math.floor(indexInLevel / 2)) * 100;
                }
            }

            updatedNodes.push({
                ...node,
                position: { x, y },
            });

            positioned.add(nodeId);

            // Posicionar filhos
            const nodeChildren = children.get(nodeId) || [];
            nodeChildren.forEach((childId, index) => {
                const childNode = nodeMap.get(childId);
                const childSide = childNode?.data?.side || (index % 2 === 0 ? 'left' : 'right');
                positionNode(childId, level + 1, index, childSide);
            });
        };

        positionNode(rootNode.id, 0, 0);

        // Adicionar nós não posicionados
        nodes.forEach(node => {
            if (!positioned.has(node.id)) {
                updatedNodes.push(node);
            }
        });

        setNodes(updatedNodes);
    }, [getNodes, getEdges, setNodes]);

    const applyRadialLayout = useCallback((config: Partial<LayoutConfig> = {}) => {
        const nodes = getNodes();
        const edges = getEdges();
        const finalConfig = { ...defaultConfig, ...config };

        const rootNode = nodes.find(node => node.id === 'root') || nodes[0];
        if (!rootNode) return;

        const updatedNodes: Node[] = [];
        const positioned = new Set<string>();

        // Posicionar nó raiz no centro
        updatedNodes.push({
            ...rootNode,
            position: { x: finalConfig.centerX, y: finalConfig.centerY },
        });
        positioned.add(rootNode.id);

        // Encontrar nós conectados ao root
        const rootConnections = edges.filter(edge => edge.source === rootNode.id);
        const radius = finalConfig.nodeSpacing;

        rootConnections.forEach((edge, index) => {
            const angle = (2 * Math.PI * index) / rootConnections.length;
            const node = nodes.find(n => n.id === edge.target);

            if (node && !positioned.has(node.id)) {
                const x = finalConfig.centerX + radius * Math.cos(angle);
                const y = finalConfig.centerY + radius * Math.sin(angle);

                updatedNodes.push({
                    ...node,
                    position: { x, y },
                });
                positioned.add(node.id);
            }
        });

        // Adicionar nós restantes
        nodes.forEach(node => {
            if (!positioned.has(node.id)) {
                updatedNodes.push(node);
            }
        });

        setNodes(updatedNodes);
    }, [getNodes, getEdges, setNodes]);

    const applyTreeLayout = useCallback((config: Partial<LayoutConfig> = {}) => {
        const nodes = getNodes();
        const edges = getEdges();
        const finalConfig = { ...defaultConfig, ...config };

        const rootNode = nodes.find(node => node.id === 'root') || nodes[0];
        if (!rootNode) return;

        // Separar nós por lado
        const leftNodes: Node[] = [];
        const rightNodes: Node[] = [];
        const centerNodes: Node[] = [rootNode];

        nodes.forEach(node => {
            if (node.id === 'root') return;

            if (node.data?.side === 'left') {
                leftNodes.push(node);
            } else if (node.data?.side === 'right') {
                rightNodes.push(node);
            }
        });

        const updatedNodes: Node[] = [];

        // Posicionar nó raiz
        updatedNodes.push({
            ...rootNode,
            position: { x: finalConfig.centerX, y: finalConfig.centerY },
        });

        // Posicionar nós do lado esquerdo
        leftNodes.forEach((node, index) => {
            const x = finalConfig.centerX - finalConfig.nodeSpacing;
            const y = finalConfig.centerY + (index - Math.floor(leftNodes.length / 2)) * 120;

            updatedNodes.push({
                ...node,
                position: { x, y },
            });
        });

        // Posicionar nós do lado direito
        rightNodes.forEach((node, index) => {
            const x = finalConfig.centerX + finalConfig.nodeSpacing;
            const y = finalConfig.centerY + (index - Math.floor(rightNodes.length / 2)) * 120;

            updatedNodes.push({
                ...node,
                position: { x, y },
            });
        });

        setNodes(updatedNodes);
    }, [getNodes, getEdges, setNodes]);

    const applyLayout = useCallback((type: LayoutType, config?: Partial<LayoutConfig>) => {
        switch (type) {
            case 'hierarchical':
                applyHierarchicalLayout(config);
                break;
            case 'radial':
                applyRadialLayout(config);
                break;
            case 'tree':
                applyTreeLayout(config);
                break;
            default:
                applyTreeLayout(config);
        }
    }, [applyHierarchicalLayout, applyRadialLayout, applyTreeLayout]);

    return {
        applyLayout,
        applyHierarchicalLayout,
        applyRadialLayout,
        applyTreeLayout,
    };
}
