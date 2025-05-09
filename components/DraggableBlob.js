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
      runOnJS(onDrop)(event.absoluteX, event.absoluteY, color, id);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
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
    marginHorizontal: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapePart: {
    position: 'absolute',
  },
});
