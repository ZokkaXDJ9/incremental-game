// unlockUtils.js
const unlockNextType = (points, index, setPoints, setUnlockedTabs) => {
    if (points[index] >= 10 && index === points.length - 1) {
      let newPoints = [...points];
      newPoints[index] -= 10;
      newPoints.push(1); // Initialize the next point type
      setPoints(newPoints);
      setUnlockedTabs((prevTabs) => [...prevTabs, String.fromCharCode(65 + index + 1)]);
    }
  };
  
  export default unlockNextType;
  