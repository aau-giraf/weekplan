import React, { ReactNode, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ProgressStepsProps = {
  steps: ReactNode[];
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  onNext: () => void;
};

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, onSubmit, isValid, isSubmitting, onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    onNext();
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

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
      <View style={styles.navigationButtons}>
        {currentStep > 0 ? (
          <TouchableOpacity style={styles.button} onPress={prevStep}>
            <Text style={styles.buttonText}>Forrige</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {currentStep < steps.length - 1 ? (
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={nextStep}>
            <Text style={styles.buttonText}>Næste</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.nextButton, !isValid || isSubmitting ? styles.disabledButton : {}]}
            onPress={onSubmit}
            disabled={!isValid || isSubmitting}>
            <Text style={styles.buttonText}>Tilføj konto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
});

export default ProgressSteps;
