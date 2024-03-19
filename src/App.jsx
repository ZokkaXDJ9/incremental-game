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
  const [upgradePointGenerationCost, setUpgradePointGenerationCost] = useState(1);
  const [upgradePointScaling, setUpgradePointScaling] = useState(1);  // Starts with 1, representing 100%
  const [isUpgradeMechanicUnlocked, setUpgradeMechanicUnlocked] = useState(false);
  const [nextLetterToUnlock, setNextLetterToUnlock] = useState('B');
  const [unlockNextLetterCost, setUnlockNextLetterCost] = useState(10);
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
      newPoints[0] += 1;
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
      newPoints[index - 1] -= 10;
      newPoints[index] += 1;
      setLetterPoints(newPoints);
    }
  };

  const unlockGameMechanic = () => {
    if (!isUpgradeMechanicUnlocked) {
      setUpgradeMechanicUnlocked(true);
      setActiveMainTab('Upgrades');
      setLetterPoints([0]);
      setUnlockedTabs(['A']);
      setUpgradePoints(upgradePoints + 10);
    } else {
      generateUpgradePoints();
    }
  };
  
  const calculatePointsToBeGenerated = () => {
    const basePoints = 100000;
    const totalLetterPoints = letterPoints.reduce((acc, points) => acc + points, 0);
    let multiplier = Math.log10(totalLetterPoints / (basePoints * upgradePointScaling));
    multiplier = Math.max(0, multiplier);
    return Math.floor(10 + multiplier);
  };

  const generateUpgradePoints = () => {
    const pointsToAward = calculatePointsToBeGenerated();
    setUpgradePoints(upgradePoints + pointsToAward);
  
    // Determine the index of the furthest unlocked letter
    const furthestUnlockedIndex = unlockedTabs.indexOf(nextLetterToUnlock) - 1;
  
    // Reset all letter points to 0 but set the last unlocked letter to 1
    const resetPoints = new Array(furthestUnlockedIndex + 1).fill(0);
    resetPoints[furthestUnlockedIndex] = 1; // Set the furthest unlocked letter to 1 point
  
    setLetterPoints(resetPoints);
  
    // Keep the tabs up to the furthest unlocked letter
    const resetTabs = unlockedTabs.slice(0, furthestUnlockedIndex + 1);
    setUnlockedTabs(resetTabs);
  };
  

  
  const upgradeTickSpeed = () => {
    if (upgradePoints >= tickSpeedCost) {
      setUpgradePoints(prevPoints => prevPoints - tickSpeedCost);
      setTickSpeed(prevSpeed => prevSpeed * 0.9);
      setTickSpeedCost(prevCost => prevCost * 2);
    }
  };

  const upgradeUpgradePointGeneration = () => {
    if (upgradePoints >= upgradePointGenerationCost) {
      setUpgradePoints(prevPoints => prevPoints - upgradePointGenerationCost);
      setUpgradePointScaling(prevScaling => prevScaling * 0.9);
      setUpgradePointGenerationCost(prevCost => prevCost * 3);
    }
  };

  const purchaseUnlockNextLetterUpgrade = () => {
    if (upgradePoints >= unlockNextLetterCost) {
      setUpgradePoints(upgradePoints - unlockNextLetterCost);
      let newLetterPoints = [...letterPoints];
      const nextLetterIndex = nextLetterToUnlock.charCodeAt(0) - 65;
  
      // Update if the letter is not already in the unlockedTabs
      if (!unlockedTabs.includes(nextLetterToUnlock)) {
        // Ensure the points array has a length to accommodate the next letter
        while (newLetterPoints.length <= nextLetterIndex) {
          newLetterPoints.push(0);
        }
        
        // Update the letter points and unlocked tabs
        newLetterPoints[nextLetterIndex] = 1; // Initialize the next letter with 1 point
        setUnlockedTabs([...unlockedTabs, nextLetterToUnlock]);
  
        // Update the next letter to unlock
        const nextLetter = String.fromCharCode(nextLetterToUnlock.charCodeAt(0) + 1);
        setNextLetterToUnlock(nextLetter);
      }
      
      setLetterPoints(newLetterPoints);
      setUnlockNextLetterCost(unlockNextLetterCost * 10);
    }
  };
  

  const renderMainTabs = () => (
    <>
      <button onClick={() => setActiveMainTab('Letters')}>Letters</button>
      {isUpgradeMechanicUnlocked && <button onClick={() => setActiveMainTab('Upgrades')}>Upgrades</button>}
    </>
  );

  const renderUpgradesTab = () => (
    <div>
      <h2>Upgrades</h2>
      <p>Upgrade Points: {upgradePoints}</p>
      <button onClick={upgradeTickSpeed} disabled={upgradePoints < tickSpeedCost}>
        Upgrade Tick Speed (Cost: {tickSpeedCost} Upgrade Points)
      </button>
      <button onClick={upgradeUpgradePointGeneration} disabled={upgradePoints < upgradePointGenerationCost}>
        Upgrade Upgrade Point Generation (Cost: {upgradePointGenerationCost} Upgrade Points)
      </button>
      <button onClick={purchaseUnlockNextLetterUpgrade} disabled={upgradePoints < unlockNextLetterCost}>
        Permanently unlock {nextLetterToUnlock} (Cost: {unlockNextLetterCost} Upgrade Points)
      </button>
    </div>
  );

  return (
    <div>
      <h1>Incremental Game</h1>
      <ProgressBar progress={getProgress()} />
      {getProgress() >= 100 && !isUpgradeMechanicUnlocked && (
        <button onClick={unlockGameMechanic}>Unlock new Dimension</button>
      )}
      {getProgress() >= 100 && isUpgradeMechanicUnlocked && (
        <div>
          <button onClick={generateUpgradePoints}>Generate Upgrade Points</button>
          <p>Points to be generated: {calculatePointsToBeGenerated()}</p>
        </div>
      )}
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
