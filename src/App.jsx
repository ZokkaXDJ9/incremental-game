import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import TabContent from './TabContent';
// import Tabs from './Tabs';
import unlockNextType from './unlockUtils';

function App() {
  const [points, setPoints] = useState([0]);
  const [gameMechanicUnlocked, setGameMechanicUnlocked] = useState(false);
  const [upgradeCounter, setUpgradeCounter] = useState(0);
  const [activeMainTab, setActiveMainTab] = useState('Letters');
  const [activeLetterTab, setActiveLetterTab] = useState('A');
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
    }, 1000);
    return () => clearInterval(interval);
  }, [gameMechanicUnlocked, points]);

  const increment = () => {
    setPoints((currentPoints) => [currentPoints[0] + 1, ...currentPoints.slice(1)]);
  };

  const upgradePoints = (index) => {
    if (index < points.length - 1 && points[index] >= 10) {
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

  const unlockGameMechanic = () => {
    setGameMechanicUnlocked(true);
    setUpgradeCounter(upgradeCounter + 1);
    setActiveMainTab('Upgrades'); // Automatically switch to Upgrades tab upon unlocking
    setPoints([0]);
    setUnlockedTabs(['A']); // Reset unlocked tabs to only 'A' initially
  };

  const renderMainTabs = () => (
    <>
      <button onClick={() => setActiveMainTab('Letters')}>Letters</button>
      {gameMechanicUnlocked && <button onClick={() => setActiveMainTab('Upgrades')}>Upgrades</button>}
    </>
  );

  const renderLetterTabs = () => (
    <>
      {unlockedTabs.map((letter) => (
        <button key={letter} onClick={() => setActiveLetterTab(letter)}>
          {letter}
        </button>
      ))}
    </>
  );

  const renderUpgradesTab = () => (
    <div>
      <h2>Upgrades</h2>
      <p>Upgrade Counter: {upgradeCounter}</p>
      {/* Future upgrade options will go here */}
    </div>
  );

  return (
    <div>
      <h1>Incremental Game</h1>
      <ProgressBar progress={getProgress()} />
      {getProgress() >= 100 && !gameMechanicUnlocked && (
        <button onClick={unlockGameMechanic}>Unlock new Game Mechanic</button>
      )}
      <div>{renderMainTabs()}</div>
      <div>{activeMainTab === 'Letters' && renderLetterTabs()}</div>
      <div>{activeMainTab === 'Letters' && (
        <TabContent 
          tab={activeLetterTab} 
          points={points} 
          increment={increment} 
          unlockNextType={() => unlockNextType(points, points.length - 1, setPoints, setUnlockedTabs)} 
          upgradePoints={upgradePoints} 
        />
      )}
      {activeMainTab === 'Upgrades' && renderUpgradesTab()}</div>
    </div>
  );
}

export default App;
