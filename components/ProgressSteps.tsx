import React, { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { View, StyleSheet } from "react-native";

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

  useImperativeHandle(ref, () => {
    const nextStep = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    };

    const previousStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    return {
      nextStep,
      previousStep,
    };
  }, [currentStep, steps.length]);

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[styles.stepCircle, index <= currentStep ? styles.activeStep : styles.inactiveStep]}
          />
        ))}
      </View>
      <View style={styles.stepContainer}>{steps[currentStep]}</View>
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: "#4CAF50",
  },
  inactiveStep: {
    backgroundColor: "#D3D3D3",
  },
  stepContainer: {
    flex: 1,
  },
});

export default ProgressSteps;
ProgressSteps.displayName = "ProgressSteps";
