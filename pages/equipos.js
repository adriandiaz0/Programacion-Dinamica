import React, { useState, useEffect } from 'react';
import Layout from '../components/layout.js';
import styles from '../components/layout.module.css';
import { reemplazo } from '../algoritmos/algoequipos.js';

const equipos = () => {
  const [plazoProyecto, setPlazoProyecto] = useState(1);
  const [vidaUtilEquipo, setVidaUtilEquipo] = useState(1);
  const [costoInicialEquipo, setCostoInicialEquipo] = useState('0');
  const [tableData, setTableData] = useState([]);
  const [tableCtxData, setTableCtxData] = useState([]);
  const [costoMantenimiento, setCostoMantenimiento] = useState([]);
  const [precioReventa, setPrecioReventa] = useState([]);
  const [showCalcularCtxButton, setShowCalcularCtxButton] = useState(false);
  const [showGuardarButton, setShowGuardarButton] = useState(false);
  const [showLoadCosts, setShowLoadCosts] = useState(false);
  const [resultadosReemplazo, setResultadosReemplazo] = useState([]);
  const [shouldRunEffect, setShouldRunEffect] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [planesOptimos, setPlanesOptimos] = useState([]);
  const [updateFinalResults, setUpdateFinalResults] = useState(false);
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);

  // Function to generate options for a dropdown from min to max values
  const generateDropdownOptions = (selectElement, min, max) => {
    for (let i = min; i <= max; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = i;
      selectElement.appendChild(option);
    }
  };

  // Function to generate table data for costoMantenimiento and precioReventa
  const generateTableData = rowCount => {
    const tableData = [];
    for (let i = 1; i <= rowCount; i++) {
      // Push an array with two elements representing each row
      tableData.push([i, 0]); // Initialize the second column with a zero
    }
    return tableData;
  };

  //Function to update costosprecios UI table
  const updatecostosPreciosTable = () => {
    const tableBody = document
      .getElementById('costosPrecios')
      .getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    for (let i = 0; i < costoMantenimiento.length; i++) {
      const row = document.createElement('tr');

      const yearCell = document.createElement('td');
      yearCell.textContent = i + 1;
      row.appendChild(yearCell);

      const maintenanceCell = document.createElement('td');
      const maintenanceInput = document.createElement('input');
      maintenanceInput.type = 'number';
      maintenanceInput.value = costoMantenimiento[i];
      maintenanceInput.onchange = e => handleCostoMantenimientoChange(i, e);
      maintenanceCell.appendChild(maintenanceInput);
      row.appendChild(maintenanceCell);

      const saleCell = document.createElement('td');
      const saleInput = document.createElement('input');
      saleInput.type = 'number';
      saleInput.value = precioReventa[i];
      saleInput.onchange = e => handlePrecioReventaChange(i, e);
      saleCell.appendChild(saleInput);
      row.appendChild(saleCell);

      tableBody.appendChild(row);
    }
  };

  // Function to handle changes in costoInicial input
  const handleCostoInicialEquipoChange = event => {
    // Ensure only numbers are entered
    const value = event.target.value.replace(/\D/, ''); // Remove non-numeric characters
    setCostoInicialEquipo(value);
  };

  // Function to handle changes in costoMantenimiento input
  const handleCostoMantenimientoChange = (index, event) => {
    const value = event.target.value;
    const newCostoMantenimiento = [...costoMantenimiento];
    newCostoMantenimiento[index] = {
      ...newCostoMantenimiento[index],
      value: value ? parseInt(value) : 0,
    };
    setCostoMantenimiento(newCostoMantenimiento);
  };

  // Function to handle changes in precioReventa input
  const handlePrecioReventaChange = (index, event) => {
    const value = event.target.value;
    const newPrecioReventa = [...precioReventa];
    newPrecioReventa[index] = {
      ...newPrecioReventa[index],
      value: value ? parseInt(value) : 0,
    };
    setPrecioReventa(newPrecioReventa);
  };

  //Calcula el balance anual
  const calculateBalanceAnual = index => {
    const mantenimiento = costoMantenimiento[index]?.value || 0;
    const reventa = precioReventa[index]?.value || 0;
    const costoInicial = parseInt(costoInicialEquipo) || 0;
    const balance = -costoInicial - mantenimiento + reventa;
    return isNaN(balance) ? 0 : balance;
  };

  //useEffect to get the initial values from their input
  useEffect(() => {
    setCostoInicialEquipo(document.getElementById('costoInicialEquipo').value);
    const plazoProyectoSelect = document.getElementById('plazoProyecto');
    const vidaUtilEquipoSelect = document.getElementById('vidaUtilEquipo');
    generateDropdownOptions(plazoProyectoSelect, 1, 30);
    generateDropdownOptions(vidaUtilEquipoSelect, 1, 10);
  }, []);

  // Function to handle changes in plazoProyecto dropdown
  const handlePlazoProyectoChange = e => {
    setPlazoProyecto(parseInt(e.target.value)); // Convert input value to integer and update state
  };

  // Function to handle changes in vidaUtilEquipo dropdown
  const handleVidaUtilEquipoChange = e => {
    setVidaUtilEquipo(parseInt(e.target.value)); // Convert input value to integer and update state
  };

  // Function to load the input values into the variables at play
  function handleLoadVariables() {
    // Retrieve values from inputs and dropdowns
    const costoInicialEquipoValue =
      document.getElementById('costoInicialEquipo').value;
    const plazoProyectoValue = document.getElementById('plazoProyecto').value;
    const vidaUtilEquipoValue = document.getElementById('vidaUtilEquipo').value;
    const rowCount = Math.min(vidaUtilEquipoValue, plazoProyectoValue);
    // Update state variables with the retrieved values
    setCostoInicialEquipo(parseInt(costoInicialEquipoValue));
    setCostoMantenimiento(generateTableData(parseInt(rowCount))); // Generate table rows for costoMantenimiento
    setPrecioReventa(generateTableData(parseInt(rowCount))); // Generate table rows for precioReventa
    setPlazoProyecto(parseInt(plazoProyectoValue));
    setVidaUtilEquipo(parseInt(vidaUtilEquipoValue));
  }

  //aciones del botón para cargar los valores iniciales
  const handleButtonClick = () => {
    handleLoadVariables();
    setShowCalcularCtxButton(true);
    setShowGuardarButton(true);
  };

  //acciones del botón para cargar los valores anuales
  const handleCalcularCtxClick = () => {
    fetchCostoPrecios();
    calcularCtx();
    console.log('Table Data:', tableData);
    console.log('Ctx Table Data', tableCtxData);
    setShowLoadCosts(true); // Show the LoadCosts when "Sumar costos" button is clicked
  };
  // Fetching data from the table with id 'costosPrecios'
  const fetchCostoPrecios = () => {
    const costoPreciosTable = document.getElementById('costosPrecios');
    if (costoPreciosTable) {
      const tableRows = costoPreciosTable.getElementsByTagName('tr');
      const data = [];

      // Iterate through each row of the table
      for (let i = 1; i < tableRows.length; i++) {
        // Start from index 1 to skip the header row
        const cells = tableRows[i].getElementsByTagName('td');
        const year = parseInt(cells[0].textContent); // Extract the year from the first cell
        const maintenance = parseFloat(cells[1].querySelector('input').value); // Extract the maintenance cost from the input in the second cell
        const sale = parseFloat(cells[2].querySelector('input').value); // Extract the sale price from the input in the third cell

        // Push the extracted data into the 'data' array
        data.push({ year, maintenance, sale });
      }
      // Update tableData state with extracted data
      setTableData(data);
    }
  };

  // Function to calculate cumulative maintenance
  const calcularCtx = () => {
    const ctxData = [];

    // Calculate cumulative maintenance for each row of ctx function
    let cumulativeMaintenance = 0;
    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i];
      const ctxValue =
        costoInicialEquipo - row.sale + row.maintenance + cumulativeMaintenance;
      cumulativeMaintenance = cumulativeMaintenance + row.maintenance; // Update cumulative cost for next iteration
      ctxData.push(ctxValue);
    }
    // Update state with computed context data
    setTableCtxData(ctxData);
  };

  // Function to generate formatted indices for the Ctx table
  const generateFormattedIndicesWithCtxData = () => {
    const formattedIndicesWithCtxData = [];
    const n = tableCtxData.length;
  
    for (let i = 1; i <= n; i++) {
      const indices = `C(0 ${i})` + ' + Ctx con el mismo salto ' + `de ${i}`;
      const ctxValue = tableCtxData[i - 1];
      formattedIndicesWithCtxData.push({ indices, ctxValue });
    }
  
    return formattedIndicesWithCtxData;
  };

  // Function to handle load file
  const handleFileInputChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      const lines = content.trim().split('\n');
      const plazoProyectoValue = parseInt(lines[0].trim());
      const vidaUtilEquipoValue = parseInt(lines[1].trim());
      const costoInicialEquipoValue = lines[2].trim();
      const costoMantenimientoValues = lines[3]
        .trim()
        .split(' ')
        .map((val, index) => ({ year: index + 1, value: parseInt(val) }));
      const precioReventaValues = lines[4]
        .trim()
        .split(' ')
        .map((val, index) => ({ year: index + 1, value: parseInt(val) }));

      setPlazoProyecto(plazoProyectoValue);
      setVidaUtilEquipo(vidaUtilEquipoValue);
      setCostoInicialEquipo(costoInicialEquipoValue);
      setCostoMantenimiento(costoMantenimientoValues);
      setPrecioReventa(precioReventaValues);
    };
    reader.readAsText(file);
    setShowCalcularCtxButton(true);
    setShowGuardarButton(true);
  };

  // Function to construct the content string for file saving
  const constructFileContent = () => {
    const plazoProyectoString = plazoProyecto.toString();
    const vidaUtilEquipoString = vidaUtilEquipo.toString();
    const costoInicialEquipoString = costoInicialEquipo.toString();

    // Extract the value from each object in costoMantenimiento
    const costoMantenimientoString = costoMantenimiento
      .map(obj => obj.value.toString().replace('.', ','))
      .join(' ');

    // Extract the value from each object in precioReventa
    const precioReventaString = precioReventa
      .map(obj => obj.value.toString().replace('.', ','))
      .join(' ');

    const numbersString = `${plazoProyectoString}\n${vidaUtilEquipoString}\n${costoInicialEquipoString}\n${costoMantenimientoString}\n${precioReventaString}`;
    return numbersString;
  };

  const saveToFile = content => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle saving to file
  const handleSaveToFile = () => {
    const numbersString = constructFileContent();
    saveToFile(numbersString);
  };

  //Función para enviar al algoritmo
  const prepareDataForReemplazo = () => {
    const table = document.getElementById('costosPrecios');
    const rows = table.getElementsByTagName('tr');
    const data = [];

    // Iterate through each row of the table
    for (let i = 1; i < rows.length; i++) {
      // Start from index 1 to skip the header row
      const cells = rows[i].getElementsByTagName('td');
      const year = parseInt(cells[0].textContent); // Extract the year from the first cell
      const maintenance = parseFloat(cells[1].querySelector('input').value); // Extract the maintenance cost from the input in the second cell
      const sale = parseFloat(cells[2].querySelector('input').value); // Extract the sale price from the input in the third cell

      // Push the extracted data into the 'data' array
      data.push({ year, maintenance, sale });
    }

    return data;
  };
  // Event handler for the "Calcular óptimos" button click
  const handleCalcularOptimosClick = () => {
    console.log('tableCtxData: ', tableCtxData);
    // Call the runEquipos function
    runEquipos();
    setShouldRunEffect(true);
  };
  // Function to run the calculations
  const runEquipos = () => {
    //const dataForReemplazo = prepareDataForReemplazo();
    const dataReemplazo = reemplazo(tableCtxData, plazoProyecto);
    console.log('Data Reemplazo:', dataReemplazo); // Debugging output
    setResultadosReemplazo(dataReemplazo);
  };
  // Call populateGtable whenever resultadosReemplazo changes
  useEffect(() => {
    if (shouldRunEffect && resultadosReemplazo) {
      console.log('Resultados Reemplazo:', resultadosReemplazo); // Debugging output
      populateGtable();
      setShouldRunEffect(false);
    }
  }, [shouldRunEffect, resultadosReemplazo]);

  // Populate the G table
  function populateGtable() {
    const tableBody = document.getElementById('resultsTableBody');
    const m = plazoProyecto + 1; // Display plazoProyecto + 1 rows

    //clean rows before populating
    while (tableBody.rows.length >= 1) {
      tableBody.deleteRow(0);
    }

    for (let i = 0; i < m; i++) {
      let G = resultadosReemplazo.G[i];
      let choices = resultadosReemplazo.selecciones[i] || [];
      let candidates = resultadosReemplazo.listaCandidatos[i] || [];

      // Ensure choices array has length plazoProyecto + 1
      while (choices.length < plazoProyecto + 1) {
        choices.push('');
      }

      // Ensure candidates array has length plazoProyecto
      while (candidates.length < plazoProyecto) {
        candidates.push('');
      }

      // Append row to table
      appendRow(tableBody, i, G, choices, candidates);
    }
  }

  // Function to create and append a table row to the G table
  function appendRow(tableBody, index, G, choices, candidates) {
    const row = document.createElement('tr');

    const indexCell = document.createElement('td');
    indexCell.textContent = index;
    row.appendChild(indexCell);

    const gCell = document.createElement('td');
    gCell.textContent = G;
    row.appendChild(gCell);

    const choicesCell = document.createElement('td');
    choicesCell.textContent = choices.join(' ');
    row.appendChild(choicesCell);

    const candidatesCell = document.createElement('td');
    if (candidates.length > 0) {
      candidatesCell.textContent = candidates.join(' ');
    } else {
      candidatesCell.textContent = ''; //Celda vacía para los candidatos de G(m)=0, que no hay
    }
    row.appendChild(candidatesCell);

    const proximusCell = document.createElement('td');
    if (choices.length > 0) {
      proximusCell.textContent = choices
        .map(choice => {
          return !isNaN(choice) && typeof choice === 'number'
            ? choice + index + 1
            : choice;
        })
        .join(' ');
    } else {
      proximusCell.textContent = ''; //Celda vacía por si no hay elementos
    }
    row.appendChild(proximusCell);

    tableBody.appendChild(row);
  }

  //manejo del botón de generar planes
  const handleGenerarPlanesClick = () => {
    const planesTemp = processTable();
    setPlanesOptimos(planesTemp);
    setUpdateFinalResults(true);
    console.log(planesTemp);
  };

  //Función recursiva para generar los planes óptimos de reemplazo
  const processTable = () => {
    const resultsTableBody = document.getElementById('resultsTableBody');
    const rows = resultsTableBody.getElementsByTagName('tr');
    const graph = {};
    const lastNodeIndex = rows.length - 1;

    // Build the graph from the table
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const currentIndex = parseInt(
        row.getElementsByTagName('td')[0].textContent.trim()
      );
      const fifthColumn = row.getElementsByTagName('td')[4].textContent.trim();
      const connections = fifthColumn
        ? fifthColumn.split(' ').map(num => parseInt(num.trim()))
        : [];
      graph[currentIndex] = connections;
    }

    const resultPaths = [];

    // Function to perform DFS and find all paths
    const dfs = (currentNode, path) => {
      path.push(currentNode);

      // If we've reached the last node, add the path to the result
      if (currentNode === lastNodeIndex) {
        resultPaths.push([...path]);
      } else {
        const neighbors = graph[currentNode] || [];
        neighbors.forEach(neighbor => {
          if (!path.includes(neighbor)) {
            dfs(neighbor, path);
          }
        });
      }

      // Backtrack
      path.pop();
    };

    // Start DFS from node 0
    dfs(0, []);

    return resultPaths;
  };

  // Function to load and process the table
  const loadAndProcessTable = () => {
    const result = processTable();
    setPaths(result);
    setCurrentPathIndex(0); // Reset the index when loading new paths
  };

  // Function to handle the "Next" button click
  const handleNextClick = () => {
    if (currentPathIndex < paths.length - 1) {
      setCurrentPathIndex(currentPathIndex + 1);
      loadAndProcessTable();
      setUpdateFinalResults(true);
    }
    setCurrentArrayIndex(prevIndex => (prevIndex + 1) % planesOptimos.length);
  };

  useEffect(() => {
    if (updateFinalResults) {
      loadAndProcessTable();
      setUpdateFinalResults(false);
    }
  }, [updateFinalResults]);

  return (
    <Layout>
      <div>
        <h1>Reemplazo de Equipos</h1>
        {/*UI for variable input */}
        <label htmlFor='costoInicialEquipo'>Costo del equipo:</label>
        <input
          type='number'
          id='costoInicialEquipo'
          name='costoInicialEquipo'
          pattern='[0-9]*' // Pattern to accept only numbers
          value={costoInicialEquipo}
          onChange={handleCostoInicialEquipoChange}
        />
        <label htmlFor='plazoProyecto'>Plazo del proyecto: </label>
        <select
          id='plazoProyecto'
          name='plazoProyecto'
          onChange={handlePlazoProyectoChange}
        ></select>
        <label htmlFor='vidaUtilEquipo'>Vida útil del equipo: </label>
        <select
          id='vidaUtilEquipo'
          name='vidaUtilEquipo'
          onChange={handleVidaUtilEquipoChange}
        ></select>
      </div>
      <div>
        {/* Table Size Input */}
        <div>
          <button onClick={handleButtonClick}>Cargar valores</button>
          <input
            text='Load File'
            type='file'
            accept='.txt'
            onChange={handleFileInputChange}
          />
        </div>

        {/* costoMantenimiento y precioReventa table */}
        <div>
          <table id='costosPrecios' className={styles.table}>
            <thead>
              <tr>
                <th>Año</th>
                <th>Mantenimiento</th>
                <th>Reventa</th>
                <th>Balance Anual</th>
              </tr>
            </thead>
            <tbody>
              {costoMantenimiento.map((maintenance, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type='number'
                      value={maintenance.value}
                      onChange={e => handleCostoMantenimientoChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type='number'
                      value={precioReventa[index]?.value || ''}
                      onChange={e => handlePrecioReventaChange(index, e)}
                    />
                  </td>
                  <td>{calculateBalanceAnual(index)}</td>{' '}
                  {/* Display calculated balance */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {showCalcularCtxButton && (
            <button
              title='Ctx es el costo de comprar el equipo en el año t y venderlo en el año x, tomando el cuenta el costo acumulado de mantenimiento durante esos años'
              onClick={handleCalcularCtxClick}
            >
              Calcular Ctx
            </button>
          )}
          {showGuardarButton && (
            <button onClick={handleSaveToFile}>Guardar archivo</button>
          )}
        </div>
        {/* LoadCosts */}
        {showLoadCosts && (
          <div name='LoadCosts'>
            {/* Display Ctx Table */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ctx por años </th>
                  <th>Costo asociado</th>
                </tr>
              </thead>
              <tbody>
                {generateFormattedIndicesWithCtxData().map((item, index) => (
                  <tr key={index}>
                    <td>{item.indices}</td>
                    <td>{item.ctxValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Button to calculate optimums */}
            <button onClick={handleCalcularOptimosClick}>
              Calcular óptimos
            </button>
            <h2>Tabla de resultados óptimos</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>G</th>
                  <th>Solución óptima</th>
                  <th>Opciones seleccionadas</th>
                  <th>Todas las opciones</th>
                  <th>Próximos</th>
                </tr>
              </thead>
              <tbody id='resultsTableBody'></tbody>
            </table>
            <div>
              {/* Button to generate replacement plans */}
              <button onClick={handleGenerarPlanesClick}>
                Generar Planes de Reemplazo
              </button>
              <div>
                {/* Display optimized plans */}
                {planesOptimos.length > 0 && (
                  <ul>
                    {planesOptimos[currentArrayIndex].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}

                {/* Button to show the next path */}
                {currentPathIndex < paths.length && (
                  <button onClick={handleNextClick}>Siguiente solución</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default equipos;
