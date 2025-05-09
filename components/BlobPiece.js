import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const colorMap = {
  blue: ['#6ec3f4', '#3a78c9'],
  pink: ['#f7a6e0', '#de4dac'],
  green: ['#a8f3cf', '#36cba2'],
  yellow: ['#fce38a', '#fcb045'],
  purple: ['#c3a6ff', '#8755d3'],
};

export default function BlobPiece({ color = 'blue', variant = 'grid', melting = false }) {
  const gradientColors = colorMap[color] || colorMap.blue;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (melting) {
      scale.value = withTiming(1.5, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [melting]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const styleVariant = variant === 'floating' ? styles.floating : styles.fixedGrid;

  return (
    <Animated.View style={[styles.baseBlob, styleVariant, animatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseBlob: {
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  fixedGrid: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  floating: {
    width: 50,
    height: 50,
    borderRadius: 999,
  },
});
