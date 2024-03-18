import React, { useState, useEffect } from 'react';

function App() {
  const [points, setPoints] = useState([0]); // Initialize with Type A points
  const [pointsPerClick] = useState(1);
  const [tickRate] = useState(1000);
  const [activeTab, setActiveTab] = useState('A'); // Start with 'A' as the active tab
  const [unlockedTabs, setUnlockedTabs] = useState(['A']); // Keep track of unlocked tabs, starting with 'A'
  const goal = 100000; // Goal for progress bar

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(currentPoints => {
        let newPoints = [...currentPoints];
        if (newPoints.length === 0) newPoints.push(0); // Ensure Type A is initialized
        for (let i = 0; i < newPoints.length - 1; i++) {
          newPoints[i] += newPoints[i + 1];
        }
        return newPoints;
      });
    }, tickRate);
    return () => clearInterval(interval);
  }, [tickRate, points]);

  const increment = () => {
    setPoints([points[0] + pointsPerClick, ...points.slice(1)]);
  };

  const unlockNextType = (index) => {
    if (points[index] >= 10 && index === points.length - 1) {
      let newPoints = [...points];
      newPoints[index] -= 10;
      newPoints.push(1); // Initialize the next point type
      setPoints(newPoints);
      setUnlockedTabs([...unlockedTabs, String.fromCharCode(65 + index + 1)]); // Add next tab to unlocked tabs
    }
  };

  const upgradePoints = (index) => {
    if (points[index] >= 10) {
      let newPoints = [...points];
      newPoints[index] -= 10;
      newPoints[index + 1] += 1;
      setPoints(newPoints);
    }
  };

  const getProgress = () => {
    const currentAPoints = points[0];
    const progressPercentage = (currentAPoints / goal) * 100;
    return Math.min(100, progressPercentage); // Ensure the percentage doesn't exceed 100
  };

  const getTabContent = (tab) => {
    const index = tab.charCodeAt(0) - 65;
    return (
      <div>
        <h2>Type {tab} Points: {points[index]}</h2>
        {index === 0 && <button onClick={increment}>Increment Type A Points</button>}
        {index > 0 && (
          <button onClick={() => upgradePoints(index - 1)} disabled={points[index - 1] < 10}>
            Buy {String.fromCharCode(65 + index)} Points
          </button>
        )}
        {index === points.length - 1 && points[index] >= 10 && (
          <button onClick={() => unlockNextType(index)}>Unlock {String.fromCharCode(66 + index)}!</button>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Incremental Game</h1>
      {getProgress() >= 100 && (
        <div style={{ margin: '10px 0' }}>
          <button onClick={() => {}}>Unlock new Content!</button>
        </div>
      )}
      <div style={{ width: '100%', backgroundColor: '#ddd', margin: '10px 0' }}>
        <div style={{ height: '20px', width: `${getProgress()}%`, backgroundColor: 'green', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {`${getProgress().toFixed(2)}%`}
        </div>
      </div>
      <div>
        {unlockedTabs.map((tab, index) => (
          <button key={index} onClick={() => setActiveTab(tab)}>
            Type {tab}
          </button>
        ))}
      </div>
      {getTabContent(activeTab)}
    </div>
  );
}

export default App;
