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
      generateUpgradePoints(); // Generate upgrade points without resetting the letters
    }
  };
  
  const generateUpgradePoints = () => {
    const basePoints = 100000; // Base point level for calculating upgrade points
    const baseUpgradePoints = 10; // Base number of upgrade points to award
  
    // Calculate the total letter points
    const totalLetterPoints = letterPoints.reduce((acc, points) => acc + points, 0);
  
    // Determine the multiplier based on total letter points
    let multiplier = Math.log10(totalLetterPoints / basePoints);
  
    // Ensure multiplier is at least 0 (no negative upgrade points)
    multiplier = Math.max(0, multiplier);
  
    // Calculate the number of upgrade points to award
    const pointsToAward = Math.floor(baseUpgradePoints + multiplier);
  
    // Add the calculated points to the current upgrade points
    setUpgradePoints(upgradePoints + pointsToAward);
  
    // Reset letter points and tabs to simulate starting a new "dimension"
    setLetterPoints([0]); // Reset letter points to start with A only
    setUnlockedTabs(['A']); // Reset unlocked tabs to only 'A' initially
  };


  const upgradeTickSpeed = () => {
    if (upgradePoints >= tickSpeedCost) {
      setUpgradePoints(prevPoints => prevPoints - tickSpeedCost);
      setTickSpeed(prevSpeed => prevSpeed * 0.9);
      setTickSpeedCost(prevCost => prevCost * 2);
    }
  };

  const purchaseUnlockNextLetterUpgrade = () => {
    if (upgradePoints >= unlockNextLetterCost) {
      setUpgradePoints(upgradePoints - unlockNextLetterCost);
      let newLetterPoints = [...letterPoints];
      let newUnlockedTabs = [...unlockedTabs];
  
      // Check if the letter is already unlocked (to avoid re-unlocking)
      const nextLetterIndex = nextLetterToUnlock.charCodeAt(0) - 65;
      if (!newLetterPoints[nextLetterIndex]) {
        newLetterPoints[nextLetterIndex] = 1; // Initialize the next letter with 1 point
        newUnlockedTabs.push(nextLetterToUnlock); // Add the next letter to unlocked tabs
      }
  
      setLetterPoints(newLetterPoints);
      setUnlockedTabs(newUnlockedTabs);
  
      // Prepare for the next letter and increase the cost
      const nextLetter = String.fromCharCode(nextLetterToUnlock.charCodeAt(0) + 1);
      setNextLetterToUnlock(nextLetter);
      setUnlockNextLetterCost(unlockNextLetterCost * 10);
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

const renderUpgradesTab = () => {
  return (
    <div>
      <h2>Upgrades</h2>
      <p>Upgrade Points: {upgradePoints}</p>
      <button onClick={upgradeTickSpeed} disabled={upgradePoints < tickSpeedCost}>
        Upgrade Tick Speed (Cost: {tickSpeedCost} Upgrade Points)
      </button>
      <button onClick={purchaseUnlockNextLetterUpgrade} disabled={upgradePoints < unlockNextLetterCost || letterPoints[nextLetterToUnlock.charCodeAt(0) - 65]}>
        Permanently unlock {nextLetterToUnlock} (Cost: {unlockNextLetterCost} Upgrade Points)
      </button>
      {/* Future upgrades can be added here */}
    </div>
  );
};

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
        <p>Points to be generated: {
          Math.floor(10 + Math.max(0, Math.log10(letterPoints.reduce((acc, points) => acc + points, 0) / 100000)))
        }</p>
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