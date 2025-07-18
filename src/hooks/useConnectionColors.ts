import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { getConnectionColor } from "../utils/colorUtils";

export const useConnectionColors = () => {
    const { getEdges, setEdges } = useReactFlow();

    const updateConnectionColors = useCallback(() => {
        const edges = getEdges();

        // Agrupa edges por pai
        const edgesByParent = edges.reduce((acc, edge) => {
            if (!acc[edge.source]) {
                acc[edge.source] = [];
            }
            acc[edge.source].push(edge);
            return acc;
        }, {} as Record<string, any[]>);

        // Atualiza as cores baseado na ordem
        const updatedEdges = edges.map(edge => {
            const parentEdges = edgesByParent[edge.source] || [];
            const sortedParentEdges = parentEdges.sort((a, b) => a.id.localeCompare(b.id));
            const childIndex = sortedParentEdges.findIndex(e => e.id === edge.id);
            const color = getConnectionColor(childIndex);

            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke: color,
                },
                data: {
                    ...edge.data,
                    color: color,
                    childIndex: childIndex
                }
            };
        });

        setEdges(updatedEdges);

        // Atualiza localStorage
        localStorage.setItem('edges', JSON.stringify(updatedEdges));
    }, [getEdges, setEdges]);

    return { updateConnectionColors };
}