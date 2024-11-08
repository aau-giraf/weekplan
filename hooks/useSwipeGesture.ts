import { useMemo, useCallback } from "react";
import { Dimensions } from "react-native";
import { Directions, Gesture } from "react-native-gesture-handler";
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const DURATIONS_MS = 250;
const X_AXIS_SENSITIVITY = 30;

/**
 * UseHook to handle horizontal swiping
 * @param goToPreviousWeek - Function to be called upon right swipe.
 * @param goToNextWeek - Function to be called upon left swipe.
 * * swipeGesture - {@link useMemo} to handle whether the swipe has crossed the threshold set by {@link X_AXIS_SENSITIVITY}
 * * boxAnimatedStyles - {@link useAnimatedStyle} to be assigned to the component to be animated
 */
const useSwipeGesture = (goToPreviousWeek: () => void, goToNextWeek: () => void) => {
  const translateX = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const { width } = Dimensions.get("window");

  const handleSwipeAnimation = useCallback(
    (width: number, action: () => void) => {
      "worklet"; //Makes this run on the UI-Thread
      translateX.value = withTiming(width, { duration: DURATIONS_MS, easing: Easing.in(Easing.exp) }, () => {
        runOnJS(action)();
        translateX.value = 0;
        translateX.value = withTiming(0, {
          duration: DURATIONS_MS,
          easing: Easing.out(Easing.exp),
        });
      });
    },
    [translateX]
  );

  const swipeGesture = useMemo(
    () =>
      Gesture.Fling()
        .withTestId("testDetector")
        .direction(Directions.RIGHT | Directions.LEFT)
        .onBegin((event) => {
          startTranslateX.value = event.x;
        })
        .onEnd((event) => {
          if (event.x < startTranslateX.value - X_AXIS_SENSITIVITY) {
            handleSwipeAnimation(-width, goToNextWeek);
          } else if (event.x > startTranslateX.value + X_AXIS_SENSITIVITY) {
            handleSwipeAnimation(width, goToPreviousWeek);
          }
        }),
    [startTranslateX, width, handleSwipeAnimation, goToPreviousWeek, goToNextWeek]
  );

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { swipeGesture, boxAnimatedStyles };
};

export default useSwipeGesture;
