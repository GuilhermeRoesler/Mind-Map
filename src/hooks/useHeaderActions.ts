import { useReactFlow } from "@xyflow/react";
import { exportMindMap, importMindMap } from "../utils/fileOperations";
import { useLayoutNodes } from "./useLayoutNodes";

export const useHeaderActions = () => {
    const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();
    const { layoutNodes } = useLayoutNodes();

    const handleHome = () => {
        console.log('Home');
    }

    const handleLayoutNodes = () => {
        layoutNodes();
        setTimeout(() => {
            fitView({ duration: 800 });
        }, 100);
    }

    const handleExport = async () => {
        try {
            const nodes = getNodes();
            const edges = getEdges();
            await exportMindMap(nodes, edges);
        } catch (error) {
            console.error('Erro ao exportar:', error);
        }
    }

    const handleImport = async () => {
        try {
            const data = await importMindMap();
            setNodes(data.nodes);
            setEdges(data.edges);
        } catch (error) {
            console.error('Erro ao importar:', error);
        }
    };

    return {
        handleHome,
        handleLayoutNodes,
        handleExport,
        handleImport
    }
}