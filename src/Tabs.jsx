import React from 'react';

function Tabs({ unlockedTabs, setActiveTab }) {
  return (
    <div>
      {unlockedTabs.map((tab, index) => (
        <button key={index} onClick={() => setActiveTab(tab)}>
          Type {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
