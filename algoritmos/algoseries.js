export function seriesFinales(homeProb, awayProb, matchCount, matchesHome, matchesVisit) {

    const table = [];
    const size = Math.ceil(matchCount / 2) +1
    const firstHome = matchesHome;
    const firstVisit = matchesVisit;

    //Inicializar la tabla
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            if (j === 0) {
                row.push(0); //Llenar la primera columna con 0s
            } else if (i === 0) {
                row.push(1); //Llenar la primera fila con 1s
            } else {
                row.push(-1); //Llenar el resto con un valor temporal
            }
        }
        table.push(row);
    }
    //Algoritmo de series
    console.log("algorithm start ");
    for (let i = 1; i < size; i++) {
        for (let j = 1; j < size; j++) {
            if (matchCount - (i+j-1) < firstHome) {
                table[i][j] = (table[i][j-1]*(1-homeProb)) + (table[i-1][j]*homeProb);   
            }
            else if (firstHome <= matchCount - (i+j-1) && matchCount - (i+j-1) <= (firstHome + firstVisit)) {
                table[i][j] = table[i][j-1]*awayProb + table[i-1][j]*(1-awayProb);
            }
            else if (matchCount - (i+j-1) > (firstHome + firstVisit)){
                table[i][j] = table[i][j-1]*(1-homeProb) + table[i-1][j]*homeProb;
            }
            
        }
        
    }

    console.log("series: ");
    table.forEach(row => console.log(row.join("\t")));
    return table;
}

