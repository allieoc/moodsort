import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, findNodeHandle, UIManager } from 'react-native';
import BlobPiece from './BlobPiece';

export default function GameGrid({ grid, onRegisterCells, meltingCells = [] }) {
  const cellRefs = useRef([]);

  if (!grid || !Array.isArray(grid) || !grid[0]) {
    console.warn('⛔️ GameGrid: grid prop invalid:', grid);
    return null;
  }

  // Generate refs ONCE on first mount
  if (cellRefs.current.length !== grid.length || cellRefs.current[0]?.length !== grid[0].length) {
    cellRefs.current = grid.map((row, rowIndex) =>
      row.map((_, colIndex) => cellRefs.current[rowIndex]?.[colIndex] || React.createRef())
    );
  }

  useEffect(() => {
    const cellLayouts = [];
    let remaining = grid.length * grid[0].length;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const ref = cellRefs.current[row][col];
        const handle = ref?.current && findNodeHandle(ref.current);
        if (handle) {
          UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            cellLayouts.push({ row, col, x: pageX, y: pageY, width, height });
            remaining--;
            if (remaining === 0) {
              console.log('🧱 Cell Layouts:', cellLayouts);
              onRegisterCells(cellLayouts);
            }
          });
        } else {
          remaining--;
        }
      }
    }
  }, [grid]);

  useEffect(() => {
    console.log('🧊 Grid rendering:', grid);
  }, [grid]);

  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const isMelting = meltingCells.some(pos => pos.row === rowIndex && pos.col === colIndex);
            return (
              <View
                key={`${rowIndex}-${colIndex}-${cell}`}
                ref={cellRefs.current[rowIndex][colIndex]}
                style={styles.cell}
              >
                    {cell && <BlobPiece color={cell} variant="grid" melting={isMelting} />}
              </View>
            );
          })}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
