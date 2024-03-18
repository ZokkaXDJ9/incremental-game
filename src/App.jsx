import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import Tabs from './Tabs';
import TabContent from './TabContent';
import unlockNextType from './unlockUtils'; // Import the unlock function

function App() {
  const [points, setPoints] = useState([0]);
  const [pointsPerClick] = useState(1);
  const [tickRate] = useState(1000);
  const [activeTab, setActiveTab] = useState('A');
  const [unlockedTabs, setUnlockedTabs] = useState(['A']);
  const goal = 100000;

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(currentPoints => {
        let newPoints = [...currentPoints];
        if (newPoints.length === 0) newPoints.push(0);
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
    return Math.min(100, (currentAPoints / goal) * 100);
  };

  return (
    <div>
      <h1>Incremental Game</h1>
      <ProgressBar progress={getProgress()} />
      <Tabs unlockedTabs={unlockedTabs} setActiveTab={setActiveTab} />
      <TabContent tab={activeTab} points={points} increment={increment} upgradePoints={upgradePoints} unlockNextType={() => unlockNextType(points, points.length - 1, setPoints, setUnlockedTabs)} />
    </div>
  );
}

export default App;
