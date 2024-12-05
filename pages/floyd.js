import React, { useState, useEffect} from 'react'; // Import useState from React
import Layout from '../components/layout.js';
import styles from '../components/layout.module.css';
import { floydWarshall } from '../algoritmos/algofloyd.js'

const Floyd = () => {
    const [nodeCount, setNodeCount] = useState(3); // State to manage the number of rows and columns
    const [stepCount, setStepCount] = useState(0); // State to manage the number of steps
    const [graph, setGraph] = useState([]); // State to manage the graph data
    const [Ptable, setPtable] = useState([]); // State to manage the p table
    const [shortestDistances, setShortestDistances] = useState([]); // State to store the shortest distances matrix
    const [shouldRunEffect, setShouldRunEffect] = useState(false);
    const [interacted, setInteracted] = useState(false); 
    const [rutasCortas, setRutasCortas] = useState([]);

    // Function to handle changes in node count input
    const handleNodeCountChange = (e) => {
        const count = parseInt(e.target.value);
        setNodeCount(count);
        updateGraph(count);
        setInteracted(true); 
    };

    // Function to handle changes in step count input
    const handleStepCountChange = (e) => {
        let count = parseInt(e.target.value);
        // Ensure step count does not exceed node count
        count = Math.min(count, nodeCount);
        setStepCount(count);
    };    

    // Function to update the graph data based on node count
    const updateGraph = (nodeCount) => {
        const newGraph = [];
        for (let i = 0; i < nodeCount; i++) {
            const row = [];
            for (let j = 0; j < nodeCount; j++) {
                if (i === j) {
                    row.push(0); // Diagonal entries set to 0
                } else {
                    row.push(Infinity); // All other entries set to Infinity
                }
            }
            newGraph.push(row);
        }
        setGraph(newGraph);
    };

    // Function to handle changes in cell input
    const handleCellChange = (e, rowIndex, colIndex) => {
        const value = parseInt(e.target.value);
        // Check if the entered value is a valid number
        if (!isNaN(value)) {
            const updatedGraph = [...graph];
            updatedGraph[rowIndex][colIndex] = value;
            setGraph(updatedGraph);
            setInteracted(true); 
        }
    };

    // Function to generate table rows dynamically based on node count
    const generateRows = () => {
        const rows = [];
        for (let i = 0; i < nodeCount; i++) {
            const cells = [];
            for (let j = 0; j < nodeCount; j++) {
                const cellValue = graph[i] ? graph[i][j] : ''; // Check if graph[i] is defined
                const displayValue = cellValue === Infinity ? '∞' : cellValue; // Represent Infinity as '∞'
                cells.push(
                    <td key={j}>
                        {interacted ? ( // Check if component has been interacted with
                            <input
                                type="number"
                                value={displayValue}
                                onChange={(e) => handleCellChange(e, i, j)}
                            />
                        ) : (
                            <span>{displayValue}</span>
                        )}
                    </td>
                );
            }
            rows.push(<tr key={i}>{cells}</tr>);
        }
        return rows;
    };

    // Function to run Floyd-Warshall algorithm
    const runFloydWarshall = () => {
        //console.log("Running Floyd-Warshall");
        //console.log("Graph:", graph);
        //console.log("Step Count:", stepCount);
        // Call the Floyd-Warshall algorithm with the graph data
        //console.log("Distances:", shortestDistances);
        const floydResult = floydWarshall(graph, stepCount);
        const shortestDistances = floydResult.dist;
        setShortestDistances(shortestDistances);
        const pTable = floydResult.ptable;
        setPtable(pTable);
    };
    
    //useEffect para control de la ejecución del algoritmo
    useEffect(() => {
        if (shouldRunEffect) {
            runFloydWarshall(); 
            setShouldRunEffect(false); 
        }
    }, [shouldRunEffect]);

    const handleFloydButtonClick = () => {
        setShouldRunEffect(true); // Set shouldRunEffect to true when the button is clicked
    };

    // Function to generate table rows for the shortest distances matrix of a cycle
    const generateCycleRows = () => {
        return shortestDistances.map((row, i) => (
            <tr key={i}>
                {row.map((distance, j) => (
                    <td key={j}>{distance}</td>
                ))}
            </tr>
        ));
    };

        // Function to generate table rows for the p table
        const generateUIPtableRows = () => {
            return Ptable.map((row, i) => (
                <tr key={i}>
                    {row.map((distance, j) => (
                        <td key={j}>{distance}</td>
                    ))}
                </tr>
            ));
        };

    // Function to handle "Next Step" button click
    const handleNextStep = () => {
        // Increment step count by 1 if it doesn't exceed node count
        if (stepCount < nodeCount) {
            setStepCount(stepCount + 1);
            setShouldRunEffect(true);
        }
    };


    // Manejo de archivos
    const handleLoadFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const newGraph = [];
            lines.forEach((line, index) => {
                // Split line by whitespace, then map each value
                const values = line.trim().split(/\s+/).map(value => {
                    const num = Number(value);
                    return isNaN(num) ? Infinity : num;
                });
                newGraph.push(values);
            });
            setNodeCount(newGraph.length);
            setGraph(newGraph);
        };
        reader.readAsText(file);
    };

    // Function to save the graph to a file
    const handleSaveFile = (graph) => {
        const lines = graph.map(row => 
            row.map(value => value === Infinity ? "_" : value).join(' ')
        );
        const content = lines.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    //Algoritmo para mostrar las rutas más cortas desde la tabla P
    const getShortestRoutes = (ptable, source) => {
        const n = ptable.length;
        const routes = Array.from({ length: n }, () => []);
    
        for (let destination = 0; destination < n; destination++) {
            if (source !== destination) {
                const path = [];
                let current = destination;
                const visited = new Set(); // To keep track of visited nodes and avoid loops
    
                while (current !== source) {
                    if (visited.has(current)) {
                        console.error(`Loop detected: ${current} already visited`);
                        path.length = 0; // Clear the path to indicate an invalid route
                        break;
                    }
                    visited.add(current);
                    
                    path.unshift(current);
                    current = parseInt(ptable[source][current], 10);
    
                    if (current === -1 || isNaN(current)) {
                        console.error(`Invalid index encountered: ${current}`);
                        path.length = 0; // Clear the path to indicate an invalid route
                        break;
                    }
                }
    
                if (path.length > 0) {
                    path.unshift(source);
                    routes[destination] = path;
                }
            }
        }
        return routes;
    };
    

    //handle para el botón de mostrar rutas cortas
    const handleDisplayRoutes = (ptable) => {
        const shortestRoutes = getShortestRoutes(ptable, 0);
        console.log(`Rutas más cortas:`, shortestRoutes);
        setRutasCortas(shortestRoutes);
    };

    return (
        <Layout>
            <div>
                <h1>Algoritmo de Floyd</h1>

                {/* Node Count Input */}
                <div>
                    <label htmlFor="nodeCountInput">Cantidad de Nodos: </label>
                    <input
                        id="nodeCountInput"
                        type="number"
                        value={nodeCount}
                        onChange={handleNodeCountChange}
                        min="2"
                    />
                </div>

                {/* Step Count Input */}
                <div>
                    <label htmlFor="stepCountInput">Cantidad de Pasos: </label>
                    <input
                        id="stepCountInput"
                        type="number"
                        value={stepCount}
                        onChange={handleStepCountChange}
                        min="1"
                        max={nodeCount} // Set maximum value equal to node count
                    />
                </div>
                
                <div>
                    <h2>Cargar y guardar archivo</h2>
                    <input type="file" accept=".txt" onChange={handleLoadFile} />
                    <button onClick={() => handleSaveFile(graph)}>Guardar grafo</button>
                </div>

                {/* Table for original graph */}
                <h2>Grafo Original / Tabla D0</h2>
                <table className={styles.table}>
                    <tbody>{generateRows()}</tbody>
                </table>

                {/* Button to run Floyd-Warshall algorithm */}
                <button onClick={handleFloydButtonClick}>Ejecutar Floyd</button>

                {/* "Next Step" button */}
                <button onClick={handleNextStep} disabled={stepCount >= nodeCount}>
                    Siguiente paso
                </button>

                {/* Message indicating step count */}
                {stepCount > 0 && (
                    <p>Pasos ejecutados: {stepCount}</p>
                )}

                {/* Table for shortest distances matrix */}
                <div>
                    <h2>Matriz de distancias más cortas</h2>
                    <table className={styles.table}>
                        <tbody>{generateCycleRows()}</tbody>
                    </table>
                </div>
                {/* Table for the P table */}
                <div>
                    <h2>Tabla P</h2>
                    <table className={styles.table}>
                        <tbody>{generateUIPtableRows()}</tbody>
                    </table>
                </div>
                <div>
                    <button onClick={() => handleDisplayRoutes(Ptable)}>Mostrar rutas más cortas</button>
                    <h3>Rutas más cortas</h3>
                    {rutasCortas.map((route, index) => (
                        <div key={index}>
                            {route.length > 0 && (
                                <p>Hacia {index}: {route.join(' -> ')}</p>
                            )}
                        </div>
                ))}
                </div>
            </div>
        </Layout>
    );
};

export default Floyd;
