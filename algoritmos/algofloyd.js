export function floydWarshall(graph, maxIterations = Infinity) {
    const n = graph.length;
    const dist = [];
    const ptable = [];
    
    //Inicializar las matrices
    for (let i = 0; i < n; i++) {
        dist[i] = [];
        ptable[i] = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                dist[i][j] = 0;
                ptable[i][j] = 0;
            } else if (graph[i][j] === undefined) {
                dist[i][j] = Infinity;
                ptable[i][j] = 0;
            } else {
                dist[i][j] = graph[i][j];
                ptable[i][j] = 0;
            }
        }
    }

    //Algoritmo de Floyd-Warshall
    for (let k = 0; k < n && k < maxIterations; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    ptable[i][j] = k + 1; //Actualizar Ptable con el índice actual (1-based)
                }
            }
        }
    }
    
    return { dist, ptable };
}