// unlockUtils.js
const unlockNextType = (letterPoints, index, setLetterPoints, setUnlockedTabs) => {
    if (letterPoints[index] >= 10 && index === letterPoints.length - 1) {
      let newPoints = [...letterPoints];
      newPoints[index] -= 10; // Deduct 10 points from the current type
      if (newPoints.length === index + 1) {
        newPoints.push(1); // Initialize the next point type with 1 point
      }
      setLetterPoints(newPoints); // Update state with the new points array
      setUnlockedTabs((prevTabs) => [...prevTabs, String.fromCharCode(65 + index + 1)]);
    }
  };
  export default unlockNextType;