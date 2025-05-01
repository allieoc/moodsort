import React from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import BlobPiece from './BlobPiece';

export default function DraggableBlob({ color, onDrop }) {
  // Move these inside the component so each blob gets its own
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      runOnJS(onDrop)(event.absoluteX, event.absoluteY, color);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View key={color} style={[animatedStyle, styles.draggable]}>
              <BlobPiece color={color} variant="floating" />
            </Animated.View>
          </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  draggable: {
    zIndex: 10,
  },
});
