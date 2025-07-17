import { useReactFlow } from "@xyflow/react";
import { exportMindMap, importMindMap } from "../utils/fileOperations";

export const useHeaderActions = () => {
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    const handleHome = () => {
        console.log('Home');
    }

    const handleMenu = () => {
        console.log('Menu');
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
        handleMenu,
        handleExport,
        handleImport
    }
}