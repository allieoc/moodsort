import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import BlobPiece from './BlobPiece';

export default function DraggableBlob({ id, color, shape, type, onDrop }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const shapeMaxX = Math.max(...shape.map(p => p.x));
  const shapeMaxY = Math.max(...shape.map(p => p.y));
  const pieceWidth = shapeMaxX * 52 + 50;
  const pieceHeight = shapeMaxY * 52 + 50;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      isDragging.value = true;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
        // Compute visual center of the shape
        const avgX = shape.reduce((sum, p) => sum + p.x, 0) / shape.length;
        const avgY = shape.reduce((sum, p) => sum + p.y, 0) / shape.length;
        // Convert shape center to pixel offset (approximate)
        const offsetX = avgX * 52;
        const offsetY = avgY * 52;

        // Final drop center
        const centerX = event.absoluteX - offsetX;
        const centerY = event.absoluteY - offsetY;

        runOnJS(onDrop)(centerX, centerY, color, id);
      translateX.value = withSpring(0, { damping: 14, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 200 });
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    zIndex: isDragging.value ? 10 : 1,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.blobContainer, animatedStyle]}>
        {shape.map(({ x, y }, index) => (
          <View
            key={index}
            style={[
              styles.shapePart,
              {
                left: x * 52 + 4,
                top: y * 52 + 4,
              },
            ]}
          >
            <BlobPiece color={color} variant="floating" />
          </View>
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
}


const styles = StyleSheet.create({
  blobContainer: {
    width: 120,
    height: 120,

    paddingHorizontal: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapePart: {
    position: 'absolute',
  },
});
