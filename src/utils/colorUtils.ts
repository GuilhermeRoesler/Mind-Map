export const CONNECTION_COLORS = [
    '#6F34DC',
    '#A645E0',
    '#DD59C9',
    '#D11A6A',
    '#E36E4B',
    '#EFAE2C',
    '#F3DD31',
    '#C5E24C',
    '#68C74F',
    '#83DFCA',
    '#31B4DE',
    '#426DCC',
] as const;

export const getConnectionColor = (childIndex: number): string => {
    return CONNECTION_COLORS[childIndex % CONNECTION_COLORS.length];
}

export const getChildIndex = (parentId: string, childId: string, edges: any[]): number => {
    // Encontra todas as conexões do pai
    const parentConnections = edges
        .filter((edge) => edge.source === parentId)
        .sort((a, b) => {
            // Ordena por ordem de criação (usando o ID da edge como referência)
            return a.id.localeCompare(b.id);
        });

    // Encontra o índice do filho atual
    const childIndex = parentConnections.findIndex((edge) => edge.target === childId);
    return childIndex >= 0 ? childIndex : 0;
};