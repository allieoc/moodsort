import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colorMap = {
  blue: ['#6ec3f4', '#3a78c9'],
  pink: ['#f7a6e0', '#de4dac'],
  green: ['#a8f3cf', '#36cba2'],
  yellow: ['#fce38a', '#fcb045'],
  purple: ['#c3a6ff', '#8755d3'],
};

export default function BlobPiece({ color = 'blue', variant = 'grid' }) {
  const gradientColors = colorMap[color] || colorMap.blue;
  const styleVariant = variant === 'floating' ? styles.floating : styles.gridBlob;

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[styles.baseBlob, styleVariant]}
    />
  );
}


const styles = StyleSheet.create({
  baseBlob: {
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gridBlob: {
    flex: 1,
    borderRadius: 12, // soft corner stretch
  },
  floating: {
    width: 50,
    height: 50,
    borderRadius: 999, // full circle
  },
});
