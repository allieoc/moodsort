import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import BlobPiece from './BlobPiece';

const CELL_SIZE = 32;

export default function DraggableBlob({ id, color, shape, type = 'normal', onDrop }) {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = offsetX.value;
      ctx.startY = offsetY.value;
    },
    onActive: (event, ctx) => {
      offsetX.value = ctx.startX + event.translationX;
      offsetY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      runOnJS(onDrop)(event.absoluteX, event.absoluteY, color, id);
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value }
    ]
  }));

  // Calculate bounding box of shape
  const maxX = Math.max(...shape.map(p => p.x));
  const maxY = Math.max(...shape.map(p => p.y));
  const width = (maxX + 1) * CELL_SIZE;
  const height = (maxY + 1) * CELL_SIZE;

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[{ width, height, marginHorizontal: 8 }, animatedStyle]}>
        <View style={{ width, height, position: 'relative' }}>
          {shape.map((coord, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: coord.x * CELL_SIZE,
                top: coord.y * CELL_SIZE
              }}
            >
              <BlobPiece color={color} variant={type === 'wild' ? 'floating' : 'grid'} />
            </View>
          ))}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
