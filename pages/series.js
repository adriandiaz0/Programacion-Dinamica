  import React, { useState, useEffect } from 'react';
  import Layout from '../components/layout.js';
  import styles from '../components/layout.module.css';
  import { seriesFinales } from '../algoritmos/algoseries.js'

  const Series = () => {
      const [matchCount, setMatchCount] = useState(3); // State to manage the number of rows
      const [AWinHomeProb, setAWinHomeProb] = useState([]); // State to manage the graph data
      const [AWinAwayProb, setAWinAwayProb] = useState([]); // State to manage the graph data    
      const [finalProbabilities, setFinalProbabilities] = useState([]); // State to store the final probabilities matrix
      const [finalTable] = useState([]); // State to store the final results table
      const [shouldRunEffect, setShouldRunEffect] = useState(false);
      const [homeStarterMatchCount, setHomeStarterMatchCount] = useState([]);
      const [visitStarterMatchCount, setVisitStarterMatchCount] = useState([]);
      const [homeLaterMatchCount, setHomeLaterMatchCount] = useState([]);
      
      // Function to handle changes in row and column count input
      const handleMatchCountChange = (e) => {
        setMatchCount(parseInt(e.target.value)); // Convert input value to integer and update state
      };

      // Function to handle changes in probability of Team A winning at home input
      const handleAWinHomeProbChange = (e) => {
        let newValue = parseFloat(e.target.value);
        // Ensure the value is between 0 and 1
        newValue = Math.min(Math.max(newValue, 0), 1);
        setAWinHomeProb(newValue);
      };

      // Function to handle changes in probability of Team A winning away input
      const handleAWinAwayProbChange = (e) => {
        let newValue = parseFloat(e.target.value);
        // Ensure the value is between 0 and 1
        newValue = Math.min(Math.max(newValue, 0), 1);
        setAWinAwayProb(newValue);
      };

      //Function to handle the series format
      const handleHomeMatchCountChange = (event) => {
        // Get the value entered in the input
        const newMatchCount = parseInt(event.target.value);      
        // Ensure newMatchCount doesn't exceed matchCount
        const updatedMatchCount = newMatchCount > matchCount ? matchCount : newMatchCount;
        // Update HomeStarterMatchCount
        setHomeStarterMatchCount(updatedMatchCount);
        // Calculate visitStarterMatchCount
        const calculatedVisitStarterMatchCount = matchCount - updatedMatchCount;
        const visitStarterMatchCount = calculatedVisitStarterMatchCount > 2 * updatedMatchCount ? calculatedVisitStarterMatchCount - updatedMatchCount : calculatedVisitStarterMatchCount;
        // Calculate homeLaterMatchCount
        let calculatedHomeLaterMatchCount = matchCount - updatedMatchCount - visitStarterMatchCount;
        // Adjust homeLaterMatchCount if it exceeds matchCount
        const homeLaterMatchCount = calculatedHomeLaterMatchCount > matchCount ? matchCount - updatedMatchCount - visitStarterMatchCount : calculatedHomeLaterMatchCount;
        // Set the state variables
        setVisitStarterMatchCount(visitStarterMatchCount);
        setHomeLaterMatchCount(homeLaterMatchCount);
      };

      // Function to run the Series algorithm
      const runSeriesAlgorithm = () => {
        console.log("Running Series");
        console.log("Match Count:", matchCount);
        // Call the Series algorithm with the input values
        const finalProbabilities = seriesFinales(AWinHomeProb, AWinAwayProb, matchCount, homeStarterMatchCount, visitStarterMatchCount);
        setFinalProbabilities(finalProbabilities);
        updateTable(finalProbabilities);
        console.log("Probabilities:", finalProbabilities);
      };
      
      useEffect(() => {
        if (shouldRunEffect) {
          runSeriesAlgorithm(); // Call the Series algorithm whenever shouldRunEffect changes
          setShouldRunEffect(false); // Reset shouldRunEffect to false after running the effect
        }
      }, [shouldRunEffect]);

      // Function to update the table with values from finalProbabilities
      const updateTable = (finalTable) => (
        <div name="finalTable">
         
            <table className={styles.table}>
                <tbody>
                    {finalTable.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                if (rowIndex === 0 && cellIndex === 0) {
                                    return <td key={cellIndex}></td>; // Leave the first cell empty
                                } else {
                                    return <td key={cellIndex}>{finalTable[rowIndex ][cellIndex ]}</td>; // Fill other cells with values from table minus 1
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );

    //Activates the algorithm on button click
    const handleButtonClick = () => {
      runSeriesAlgorithm();
      setShouldRunEffect(true);
    };
    
    const handleAllMatchCountsChange = (event) => {
      handleMatchCountChange(event);
      //handleHomeMatchCountChange(event);
    };

    //manejo de archivos: carga
    const handleLoadFile = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
          const data = e.target.result;
  
          // Split the data by newline character
          const lines = data.trim().split('\n');
  
          // Ensure the file has the correct number of lines
          if (lines.length !== 5) {
              console.error('Invalid file format');
              return;
          }
  
          // Parse and assign values
          const matchCount = parseInt(lines[0]);
          const aWinHomeProb = parseFloat(lines[1]);
          const aWinAwayProb = parseFloat(lines[2]);
          const homeStarterMatchCount = parseInt(lines[3]);
          const visitStarterMatchCount = parseInt(lines[4]);
  
          // Set the values using the appropriate functions
          setMatchCount(matchCount);
          setAWinHomeProb(aWinHomeProb);
          setAWinAwayProb(aWinAwayProb);
          setHomeStarterMatchCount(homeStarterMatchCount);
          setVisitStarterMatchCount(visitStarterMatchCount);
      };
  
      reader.readAsText(file);
  };
  //manejo de archivos: guardado
  const handleSaveToFile = () => {

      // Create a string containing the numbers separated by newline
      const numbersString = `${matchCount}\n${AWinHomeProb}\n${AWinAwayProb}\n${homeStarterMatchCount}\n${visitStarterMatchCount}`;

      // Call the function to save the string to a file
      saveToFile(numbersString);
  };

  const saveToFile = (data) => {
      const blob = new Blob([data], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'output.txt';
      a.click();
  };

    const tableInterface = updateTable(finalProbabilities);
      
    return (
      <Layout>
        <div>
          <h1>Series Finales</h1>
  
          {/* Table Size Input */}
          <div>
            <label htmlFor="matchCountInput">Match Count: </label>
            <input
              id="matchCountInput"
              type="number"
              value={matchCount}
              onChange={handleAllMatchCountsChange}
              min="1"
            />
          </div>
          <div>
            <label htmlFor="HomeStarterMatchCountInput">Home Starting Match Count: </label>
            <input
              id="HomeStarterMatchCountInput"
              type="number"
              value={homeStarterMatchCount}
              onChange={handleHomeMatchCountChange}
              min="1"
            />
            <label htmlFor="Series Format">Series format: </label>
            <span>{homeStarterMatchCount}-{visitStarterMatchCount}-{homeLaterMatchCount}</span>

          </div>  
          <div>
            <label htmlFor="AWinHomeProbInput">Prob A ganar casa: </label>
            <input
              id="AWinHomeProbInput"
              type="number"
              value={AWinHomeProb}
              onChange={handleAWinHomeProbChange}
              min="0"
              max="1"
              step="0.01" // Allow increments and decrements by 0.01
            />
            <label htmlFor="AWinHomeProbInput">Prob B ganar visita: </label>
            <span>{(1 - AWinHomeProb).toFixed(2)}</span>
          </div>
          <div>  
            <label htmlFor="AWinAwayProbInput">Prob A ganar visita: </label>
            <input
              id="AWinAwayProbInput"
              type="number"
              value={AWinAwayProb}
              onChange={handleAWinAwayProbChange}
              min="0"
              max="1"
              step="0.01" // Allow increments and decrements by 0.01
            />
            <label htmlFor="AWinAwayProbInput">Prob B ganar casa: </label>
            <span>{(1 - AWinAwayProb).toFixed(2)}</span>            
          </div>

          {/* Button to run series algorithm and update table*/}
          <button onClick={handleButtonClick}>Correr algoritmo de series finales</button>
          <input text="Load File" type="file" accept=".txt" onChange={handleLoadFile} />
          <button onClick={handleSaveToFile}>Guardar Archivo</button>

          {tableInterface}
          <div name="finalTable">
            <table className={styles.table}>
              <tbody>
                {finalTable.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
      </Layout>
    );
  };
export default Series;