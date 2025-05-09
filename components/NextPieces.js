import React from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableBlob from './DraggableBlob';

const SHAPES = {
  single: [{ x: 0, y: 0 }],
  barH: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
  barV: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
  square: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  L: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
};

const SPECIAL_TYPES = ['wild', 'bomb', 'clear'];

export default function NextPieces({ pieces = [], onDrop }) {
  return (
    <View style={styles.container}>
      {pieces.map((piece, index) => (
        <DraggableBlob
          key={piece.id}
          id={piece.id}
          color={piece.color}
          shape={piece.shape || SHAPES.single}
          type={piece.type || 'normal'}
          onDrop={onDrop}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
      paddingHorizontal: 16, // ✅ add this
    },
});

// Helper to generate a random blob piece
export function generateRandomPiece() {
  const id = `blob-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const color = ['blue', 'pink', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)];

  const shapeKeys = Object.keys(SHAPES);
  const shape = SHAPES[shapeKeys[Math.floor(Math.random() * shapeKeys.length)]];

  const specialChance = Math.random();
  let type = 'normal';
  if (specialChance < 0.05) {
    type = SPECIAL_TYPES[Math.floor(Math.random() * SPECIAL_TYPES.length)];
  }

  return { id, color, shape, type };
}
