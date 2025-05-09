import React, { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import GameGrid from './components/GameGrid';
import NextPieces, { generateRandomPiece } from './components/NextPieces';

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
  const [meltingCells, setMeltingCells] = useState([]);
  const cellLayoutsRef = useRef([]);

  const handleRegisterCells = (layouts) => {

    cellLayoutsRef.current = layouts;
  };

  const isGridFull = (gridToCheck) =>
    gridToCheck.every(row => row.every(cell => cell !== null));

  const checkForMatches = (gridToCheck) => {
    const newGrid = gridToCheck.map(row => [...row]);
    const toClear = [];

    for (let row = 0; row < newGrid.length - 1; row++) {
      for (let col = 0; col < newGrid[0].length - 1; col++) {
        const topLeft = newGrid[row][col];
        const topRight = newGrid[row][col + 1];
        const bottomLeft = newGrid[row + 1][col];
        const bottomRight = newGrid[row + 1][col + 1];

        if (
          topLeft &&
          topLeft === topRight &&
          topLeft === bottomLeft &&
          topLeft === bottomRight
        ) {
          toClear.push(
            { row, col },
            { row, col: col + 1 },
            { row: row + 1, col },
            { row: row + 1, col: col + 1 }
          );
        }
      }
    }

    if (toClear.length > 0) {
   
      setMeltingCells(toClear);
      setTimeout(() => {
        const afterClearGrid = newGrid.map((row, r) =>
          row.map((cell, c) => {
            return toClear.some(pos => pos.row === r && pos.col === c) ? null : cell;
          })
        );
        setGrid(afterClearGrid);
        setMeltingCells([]);
      }, 300);
    }
  };

  const handleDrop = (dropX, dropY, color, id) => {
    console.log('📦 Dropped:', { dropX, dropY, color, id });

    const droppedPiece = nextPieces.find(p => p.id === id);
    if (!droppedPiece) return;

    const { shape } = droppedPiece;

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
      return;
    }

    const newGrid = grid.map(row => [...row]);
    shape.forEach(({ x, y }) => {
      const r = baseRow + y;
      const c = baseCol + x;
      newGrid[r][c] = color;
    });
      setGrid(newGrid);

      const updatedPieces = nextPieces.filter(p => p.id !== id);
      setNextPieces(updatedPieces);

      if (updatedPieces.length === 0) {
        setNextPieces(generateNextPieces());
      }

      // Delay logic so grid has time to visually update
      setTimeout(() => {
        checkForMatches(newGrid);
        if (isGridFull(newGrid)) {
          setGameOver(true);
        }
      }, 100);
  };

  if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0])) {
    console.warn('⛔️ Skipping render: Grid not initialized');
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
          <View style={{ marginBottom: 24 }}>
            <GameGrid grid={grid} onRegisterCells={handleRegisterCells} meltingCells={meltingCells} />
          </View>
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
      justifyContent: 'center', // was center
      paddingTop: 48, // gives space above the grid
      paddingBottom: 40,
      paddingHorizontal: 16, // adds side margin!
    },
});
