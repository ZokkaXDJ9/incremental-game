import React from 'react';

function ProgressBar({ progress }) {
  return (
    <div style={{ width: '100%', backgroundColor: '#ddd', margin: '10px 0' }}>
      <div style={{ height: '20px', width: `${progress}%`, backgroundColor: 'green', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {`${progress.toFixed(2)}%`}
      </div>
    </div>
  );
}

export default ProgressBar;
