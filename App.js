import React, { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import GameGrid from './components/GameGrid';
import NextPieces from './components/NextPieces';

export default function App() {
  const [grid, setGrid] = useState(
    Array(4).fill(null).map(() => Array(4).fill(null))
  );
  const [nextPieces, setNextPieces] = useState(['blue', 'pink', 'green']);
  const cellLayoutsRef = useRef([]);

    const handleRegisterCells = (layouts) => {
  
      cellLayoutsRef.current = layouts;
    };

  const handleDrop = (dropX, dropY, color) => {
    const target = cellLayoutsRef.current.find(cell =>
      dropX >= cell.x &&
      dropX <= cell.x + cell.width &&
      dropY >= cell.y &&
      dropY <= cell.y + cell.height

    );
    
    if (target && !grid[target.row][target.col]) {
      const newGrid = [...grid];
      newGrid[target.row][target.col] = color;
      setGrid(newGrid);
        console.log('✅ Found match at', target.row, target.col);
      const updatedPieces = [...nextPieces];
      updatedPieces.shift();
      setNextPieces(updatedPieces);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GameGrid grid={grid} setGrid={setGrid} onRegisterCells={handleRegisterCells} />
        <NextPieces pieces={nextPieces} onDrop={handleDrop} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1f3b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
});
