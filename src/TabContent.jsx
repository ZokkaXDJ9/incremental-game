import React from 'react';

function TabContent({ tab, points, increment, upgradePoints, unlockNextType }) {
  const index = tab.charCodeAt(0) - 65;
  return (
    <div>
      <h2>{tab} Points: {points[index]}</h2>
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
}

export default TabContent;
