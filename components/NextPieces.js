import React from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableBlob from './DraggableBlob';

export default function NextPieces({ pieces = [], onDrop }) {
  return (
    <View style={styles.container}>
          {pieces.map((color, index) => (
            <View key={`${color}-${index}`} style={styles.pieceWrapper}>
              <DraggableBlob color={color} onDrop={onDrop} id={`${color}-${index}`} />
            </View>
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  pieceWrapper: {
    marginHorizontal: 8,
  },
});
