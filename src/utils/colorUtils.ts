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
    console.log(`childIndex ${childIndex}`);
    return CONNECTION_COLORS[childIndex % CONNECTION_COLORS.length];
}

export const getChildIndex = (parentId: string, childId: string, edges: any[], side?: 'left' | 'right'): number => {
    let parentConnections = edges.filter((edge) => edge.source === parentId);

    // Se um lado específico foi fornecido, filtra apenas por esse lado
    if (side) {
        const expectedHandle = side === 'right' ? 'left-target' : 'right-target';
        parentConnections = parentConnections.filter(edge => edge.targetHandle === expectedHandle);
    }

    parentConnections.sort((a, b) => {
        return a.id.localeCompare(b.id);
    });

    const childIndex = parentConnections.findIndex((edge) => edge.target === childId);
    return childIndex >= 0 ? childIndex : 0;
};
