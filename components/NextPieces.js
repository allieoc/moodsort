import React from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableBlob from './DraggableBlob';

export default function NextPieces({ pieces = [], onDrop }) {
  return (
    <View style={styles.container}>
          {pieces.map((piece) => (
            <View key={piece.id} style={styles.pieceWrapper}>
              <DraggableBlob color={piece.color} id={piece.id} onDrop={onDrop} />
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
