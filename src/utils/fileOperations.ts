import type { Node, Edge } from '@xyflow/react';

export interface MindMapData {
    nodes: Node[];
    edges: Edge[];
}

export const exportMindMap = async (nodes: Node[], edges: Edge[]): Promise<void> => {
    const data: MindMapData = { nodes, edges };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });

    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: nodes[0].data.label,
            types: [
                {
                    description: 'Arquivo JSON',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
    } catch (err) {
        console.error('Operação de exportação cancelada ou erro:', err);
        throw err;
    }
};

export const importMindMap = async (): Promise<MindMapData> => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Arquivo JSON',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
        });

        const file = await fileHandle.getFile();
        const contents = await file.text();
        const data = JSON.parse(contents) as MindMapData;

        // Validação básica
        if (!data.nodes || !data.edges) {
            throw new Error('Formato de arquivo inválido');
        }

        return data;
    } catch (err) {
        console.error('Operação de importação cancelada ou erro:', err);
        throw err;
    }
};