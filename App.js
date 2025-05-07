import React, { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import GameGrid from './components/GameGrid';
import NextPieces from './components/NextPieces';
import { generateRandomPiece } from './components/NextPieces';


const COLORS = ['blue', 'pink', 'green', 'yellow', 'purple'];
let blobCounter = 0;

const generateNextPieces = () => {
  return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
};

export default function App() {
    const [grid, setGrid] = useState(
      Array(6).fill(null).map(() => Array(6).fill(null))
    );
  const [nextPieces, setNextPieces] = useState(generateNextPieces());
  const [gameOver, setGameOver] = useState(false);
  const cellLayoutsRef = useRef([]);

  const handleRegisterCells = (layouts) => {
    console.log('🧱 Cell layouts:', layouts);
    cellLayoutsRef.current = layouts;
  };

  const isGridFull = (gridToCheck) =>
    gridToCheck.every(row => row.every(cell => cell !== null));

  const checkForMatches = (gridToCheck) => {
    const newGrid = gridToCheck.map(row => [...row]);
      for (let row = 0; row < grid.length - 1; row++) {
        for (let col = 0; col < grid[0].length - 1; col++) {
        const val = newGrid[row][col];
        if (
          val &&
          newGrid[row][col + 1] === val &&
          newGrid[row + 1][col] === val &&
          newGrid[row + 1][col + 1] === val
        ) {
          newGrid[row][col] = null;
          newGrid[row][col + 1] = null;
          newGrid[row + 1][col] = null;
          newGrid[row + 1][col + 1] = null;
        }
      }
    }
    setGrid(newGrid);
  };

    const handleDrop = (dropX, dropY, color, id) => {
      console.log('📦 Dropped:', { dropX, dropY, color, id });

      const droppedPiece = nextPieces.find(p => p.id === id);
      if (!droppedPiece) return;

      const { shape } = droppedPiece;

      // Find the cell the first square landed on
      const anchorCell = cellLayoutsRef.current.find(cell =>
        dropX >= cell.x &&
        dropX <= cell.x + cell.width &&
        dropY >= cell.y &&
        dropY <= cell.y + cell.height
      );

      if (!anchorCell) {
        console.log('❌ No anchor cell found');
        return;
      }

      const baseRow = anchorCell.row;
      const baseCol = anchorCell.col;

      // Check if all shape cells fit
      const canPlace = shape.every(({ x, y }) => {
        const r = baseRow + y;
        const c = baseCol + x;
        return (
          r >= 0 &&
          r < grid.length &&
          c >= 0 &&
          c < grid[0].length &&
          !grid[r][c]
        );
      });

      if (!canPlace) {
        console.log('🚫 Cannot place shape: space occupied or out of bounds');
        return;
      }

      // Place the shape
      const newGrid = grid.map(row => [...row]);
      shape.forEach(({ x, y }) => {
        const r = baseRow + y;
        const c = baseCol + x;
        newGrid[r][c] = color;
      });
      setGrid(newGrid);

      // Remove used piece
      const updatedPieces = nextPieces.filter(p => p.id !== id);
      setNextPieces(updatedPieces);

      // Refresh if none left
      if (updatedPieces.length === 0) {
        setNextPieces(generateNextPieces());
      }

      checkForMatches(newGrid);

      if (isGridFull(newGrid)) {
        setGameOver(true);
      }
    };

    if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
      console.warn('⛔️ Skipping render: Grid not initialized');
      return null;
    }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GameGrid grid={grid} onRegisterCells={handleRegisterCells} />
        <NextPieces pieces={nextPieces} onDrop={handleDrop} />
        {gameOver && (
          <Text style={{ color: 'white', fontSize: 24, marginTop: 20 }}>
            Game Over 😵 Tap to restart
          </Text>
        )}
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
