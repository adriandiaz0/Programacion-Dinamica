export function reemplazo(tablactx, plazoProyecto) {

    let m = plazoProyecto;
    const G = Array(m + 1).fill(0); // Arreglo para las respuestas optimas de largo: m+1
    const selecciones = Array(m + 1).fill(null).map(() => []); // Arreglo para los indices de los candidatos seleccionados
    const listaCandidatos = Array(m).fill(null).map(() => []); // Arreglo para los candidatos a G[m]

    //Algoritmo de reemplazo
    //Itera de m-1 a 0, G(m)=0
    for (let i = m - 1; i >= 0; i--) {
        const candidatos = []; //arreglo interno para los candidatos a cada G(m)
        /*Itera de j a m-1-i para que no se pase del length de G y con la condición
        de que no se pase de la cantidad de valores de Ctx en tablactx*/
        for (let j = 0; j <= m - 1 - i && j < tablactx.length; j++) {
            candidatos.push(tablactx[j] + G[i + 1 + j]); // 
        }
        listaCandidatos[i] = candidatos; // Almacena los candidatos para el G[i] actual
        const minValue = Math.min(...candidatos); //Elige el mejor de todos los candidatos 

        // Almacena los indices de los candidatos con menor valor
        for (let j = 0; j <= m - 1 - i && j < tablactx.length; j++) {
            if (tablactx[j] + G[i + 1 + j] === minValue) {
                selecciones[i].push(j);
            }
        }
        //Almacena el candidato con menor valor
        G[i] = minValue;
    }
    //Se retornan todos los datos para mostrar en interfaz grafica
    return { G, selecciones, listaCandidatos };
}