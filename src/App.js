import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const [scannedData, setScannedData] = useState(null);
  const [correctOption, setCorrectOption] = useState('');
  const [score, setScore] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3006');
    socket.on('connect', () => console.log('✅ Connected to WebSocket server'));

    socket.on('scannedData', (data) => {
      const cleaned = data?.toString().trim();
      console.log('📥 Received scanned data:', cleaned);
      setScannedData(cleaned);
      setScore(null); // reset score on new scan
    });

    return () => {
      socket.off('scannedData');
      socket.disconnect();
    };
  }, []);

  const handleEvaluate = () => {
    if (!scannedData || !correctOption) {
      alert('Both scanned data and correct option are required!');
      return;
    }

    // Extract only the selected option (A/B/C/D) from scanned data
    const match = scannedData.trim().toUpperCase().match(/[A-D](?!.*[A-D])/);
    const cleanedScan = match ? match[0] : '';
    const correct = correctOption.trim().toUpperCase();

    console.log(`🔍 Comparing: cleaned="${cleanedScan}" vs correct="${correct}"`);

    const result = cleanedScan === correct ? 1 : 0;
    setScore(result);
  };

  return (
    <div className="app-container">
      <h1>Evaluator Dashboard</h1>

      <div className="scanned-box">
        {scannedData ? `Student Answer: "${scannedData}"` : 'Waiting for scan...'}
      </div>

      <div className="selector-section">
        <label htmlFor="correctOption">Select Correct Option:</label>
        <select
          id="correctOption"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>

      <button onClick={handleEvaluate}>Evaluate</button>

      {score !== null && (
        <div className="result">
          Score: {score} {score === 1 ? '✅ Correct' : '❌ Incorrect'}
        </div>
      )}
    </div>
  );
};

export default App;
