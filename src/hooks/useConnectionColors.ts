import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { getConnectionColor } from "../utils/colorUtils";

export const useConnectionColors = () => {
    const { getEdges, setEdges } = useReactFlow();

    const updateConnectionColors = useCallback(() => {
        const edges = getEdges();

        // Agrupa edges por pai E por lado
        const edgesByParentAndSide = edges.reduce((acc, edge) => {
            const key = `${edge.source}-${edge.targetHandle}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(edge);
            return acc;
        }, {} as Record<string, any[]>);

        // Atualiza as cores baseado na ordem por lado
        const updatedEdges = edges.map(edge => {
            const key = `${edge.source}-${edge.targetHandle}`;
            const sideEdges = edgesByParentAndSide[key] || [];
            const sortedSideEdges = sideEdges.sort((a, b) => a.id.localeCompare(b.id));
            const childIndex = sortedSideEdges.findIndex(e => e.id === edge.id);
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
