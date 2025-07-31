import { useCallback } from "react";
import { useReactFlow, type Node, type Edge, Position } from "@xyflow/react";
import dagre from 'dagre';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const isHorizontal = direction === 'LR';

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

export const useLayoutNodes = () => {
    const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

    const layoutNodes = useCallback(() => {
        const { nodes, edges } = getLayoutedElements(getNodes(), getEdges());
        console.log(nodes)
        setNodes(nodes);
        setEdges(edges);

        if (false)
            fitView({ duration: 500 });

        localStorage.setItem('nodes', JSON.stringify(nodes));
        localStorage.setItem('edges', JSON.stringify(edges));
    }, [getNodes, getEdges, setNodes, setEdges])

    return { layoutNodes };
}