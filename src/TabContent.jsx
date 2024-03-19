import React from 'react';

function TabContent({ tab, letterPoints, increment, buyNextPointType, unlockNextType }) {
  const index = tab.charCodeAt(0) - 65;
  const letterPoint = letterPoints && letterPoints.length > index ? letterPoints[index] : 0;

  return (
    <div>
      <h2>{tab} Points: {letterPoint}</h2>
      {index === 0 && (
        <button onClick={increment}>Click to generate A Points</button>
      )}
      {index > 0 && (
        <button onClick={() => buyNextPointType(index)} disabled={letterPoints[index - 1] < 10}>
          Buy {String.fromCharCode(65 + index)} Points
        </button>
      )}
      {index === letterPoints.length - 1 && letterPoint >= 10 && (
        <button onClick={() => unlockNextType(index)}>Unlock {String.fromCharCode(66 + index)}!</button>
      )}
    </div>
  );
}

export default TabContent;
