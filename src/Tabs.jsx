import React from 'react';

function Tabs({ unlockedTabs, setActiveTab }) {
  return (
    <div>
      {unlockedTabs.map((tab, index) => (
        <button key={index} onClick={() => setActiveTab(tab)}>
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
