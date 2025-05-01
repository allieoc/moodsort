import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, findNodeHandle, UIManager } from 'react-native';
import BlobPiece from './BlobPiece';

const GRID_SIZE = 4;

export default function GameGrid({ grid, setGrid, onRegisterCells }) {
    const cellRefs = useRef(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(null).map(() => React.createRef()))
    );
  useEffect(() => {
    const cellLayouts = [];

    let remaining = GRID_SIZE * GRID_SIZE;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const handle = findNodeHandle(cellRefs.current[row][col].current);
        if (handle) {
          UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            cellLayouts.push({
              row,
              col,
              x: pageX,
              y: pageY,
              width,
              height,
            });
            remaining--;
            if (remaining === 0) {
              onRegisterCells(cellLayouts);
            }
          });
        }
      }
    }
  }, []);

  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={colIndex}
              ref={cellRefs.current[rowIndex][colIndex]}
              style={styles.cell}
            >
              {cell && <BlobPiece color={cell} variant="grid" />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 10,
    backgroundColor: '#2a2f4f',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 60,
    height: 60,
    margin: 4,
    backgroundColor: '#3a3f6c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#525885',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
