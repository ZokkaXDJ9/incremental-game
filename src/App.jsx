import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import TabContent from './TabContent';
import Tabs from './Tabs';
import unlockNextType from './unlockUtils';

function App() {
  const [letterPoints, setLetterPoints] = useState([0]);
  const [upgradePoints, setUpgradePoints] = useState(0);
  const [tickSpeed, setTickSpeed] = useState(1000);
  const [tickSpeedCost, setTickSpeedCost] = useState(1);
  // const [gameMechanicUnlocked, setGameMechanicUnlocked] = useState(false);
  const [isUpgradeMechanicUnlocked, setUpgradeMechanicUnlocked] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('Letters');
  const [activeLetterTab, setActiveLetterTab] = useState('A');
  const [unlockedTabs, setUnlockedTabs] = useState(['A']);
  const goal = 100000;

  useEffect(() => {
    const interval = setInterval(() => {
      setLetterPoints(currentPoints => {
        let newPoints = [...currentPoints];
        if (newPoints.length === 0) newPoints.push(0);
        for (let i = 0; i < newPoints.length - 1; i++) {
          newPoints[i] += newPoints[i + 1];
        }
        return newPoints;
      });
    }, tickSpeed);
    return () => clearInterval(interval);
  }, [tickSpeed, letterPoints]);

  const incrementLetterPoints = () => {
    setLetterPoints((currentPoints) => {
      let newPoints = [...currentPoints];
      newPoints[0] += 1; // Increment Type A points
      return newPoints;
    });
  };

  const getProgress = () => {
    const currentLetterPoints = letterPoints[0];
    return Math.min(100, (currentLetterPoints / goal) * 100);
  };

  const buyNextPointType = (letterPoints, index, setLetterPoints) => {
    if (index > 0 && letterPoints[index - 1] >= 10) {
      let newPoints = [...letterPoints];
      newPoints[index - 1] -= 10;  // Deduct 10 points from the previous type
      newPoints[index] += 1;  // Increment the next type by 1 point
      setLetterPoints(newPoints);
    }
  };

  const unlockGameMechanic = () => {
    if (!isUpgradeMechanicUnlocked) {
      setUpgradeMechanicUnlocked(true);
      setActiveMainTab('Upgrades');
      setLetterPoints([0]); // Reset letter points
      setUnlockedTabs(['A']); // Reset unlocked tabs to only 'A' initially
      setUpgradePoints(upgradePoints + 10); // Provide initial upgrade points
    } else {
      // Once the mechanic is unlocked, this will handle generating upgrade points
      setLetterPoints([0]); // Reset letter points
      setUnlockedTabs(['A']); // Reset unlocked tabs to only 'A' initially
      setUpgradePoints(upgradePoints + 10); // Increment upgrade points
    }
  };
  

  const upgradeTickSpeed = () => {
    if (upgradePoints >= tickSpeedCost) {
      setUpgradePoints(prevPoints => prevPoints - tickSpeedCost);
      setTickSpeed(prevSpeed => prevSpeed * 0.9);
      setTickSpeedCost(prevCost => prevCost * 2);
    }
  };

  const renderMainTabs = () => (
    <>
      <button onClick={() => setActiveMainTab('Letters')}>Letters</button>
      {isUpgradeMechanicUnlocked && <button onClick={() => setActiveMainTab('Upgrades')}>Upgrades</button>}
    </>
  );

//  const renderLetterTabs = () => (
//    <>
//      {unlockedTabs.map((letter) => (
//        <button key={letter} onClick={() => setActiveLetterTab(letter)}>
//          {letter}
//        </button>
//      ))}
//    </>
//  );

  const renderUpgradesTab = () => (
    <div>
      <h2>Upgrades</h2>
      <p>Upgrade Points: {upgradePoints}</p>
      <button onClick={upgradeTickSpeed} disabled={upgradePoints < tickSpeedCost}>
        Upgrade Tick Speed (Cost: {tickSpeedCost} Upgrade Points)
      </button>
      {/* Future upgrades can be added here */}
    </div>
  );

  return (
    <div>
      <h1>Incremental Game</h1>
      <ProgressBar progress={getProgress()} />
      <div>{getProgress() >= 100 && (
        <button onClick={unlockGameMechanic}>
          {isUpgradeMechanicUnlocked ? "Generate Upgrade Points" : "Unlock new Game Mechanic"}
        </button>
      )}</div>
      {renderMainTabs()}
      {activeMainTab === 'Letters' && (
        <>
          <Tabs unlockedTabs={unlockedTabs} setActiveTab={setActiveLetterTab} />
          <TabContent 
            tab={activeLetterTab} 
            letterPoints={letterPoints} 
            increment={incrementLetterPoints}
            buyNextPointType={(index) => buyNextPointType(letterPoints, index, setLetterPoints)}
            unlockNextType={() => unlockNextType(letterPoints, letterPoints.length - 1, setLetterPoints, setUnlockedTabs)}
          />
        </>
      )}
      {activeMainTab === 'Upgrades' && renderUpgradesTab()}
    </div>
  );
  
}

export default App;
