import React, { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from "react-native-reanimated";
import { colors, ScaleSize } from "../utils/SharedStyles";

type ProgressStepsProps = {
  children: ReactNode;
};

export type ProgressStepsMethods = {
  nextStep: () => void;
  previousStep: () => void;
};

const ProgressSteps = forwardRef<ProgressStepsMethods, ProgressStepsProps>((props, ref) => {
  const { children } = props;
  const steps = React.Children.toArray(children);
  const [currentStep, setCurrentStep] = useState(0);

  const opacity = useSharedValue(1);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => {
        opacity.value = 0.5;
        opacity.value = withTiming(1);
        return prev + 1;
      });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => {
        opacity.value = 0.5;
        opacity.value = withTiming(1);
        return prev - 1;
      });
    }
  };

  useImperativeHandle(ref, () => ({
    nextStep: goToNextStep,
    previousStep: goToPreviousStep,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        {steps.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.stepCircle,
              index <= currentStep
                ? { backgroundColor: colors.green }
                : { backgroundColor: colors.lightGray },
              index === currentStep && [animatedStyle, { transform: [{ scale: 1.1 }] }],
            ]}
          />
        ))}
      </View>

      <Animated.View key={currentStep} entering={FadeIn} style={{ flex: 1 }}>
        {steps[currentStep]}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepCircle: {
    width: ScaleSize(20),
    height: ScaleSize(20),
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default ProgressSteps;
ProgressSteps.displayName = "ProgressSteps";
