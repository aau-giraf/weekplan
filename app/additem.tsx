import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useDate } from '../providers/DateProvider';
import { prettyDate } from '../utils/prettyDate';
import useActivity from '../hooks/useActivity';

type FormData = {
  label: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

const AddItem = () => {
  const router = useRouter();
  const { selectedDate } = useDate();
  const { useCreateActivity } = useActivity({ date: selectedDate });
  const [formData, setFormData] = useState<FormData>({
    label: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const { label, description, startTime, endTime } = formData;

    const formattedStartTime = startTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedEndTime = endTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await useCreateActivity.mutateAsync({
      citizenId: 1,
      data: {
        activityId: -1,
        name: label,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        date: selectedDate.toDateString(),
        isCompleted: false,
      },
    });
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.headerText}>
            Opret en begivenhed til {prettyDate(selectedDate)}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Navn"
            value={formData.label}
            onChangeText={(text) => handleInputChange('label', text)}
            returnKeyType="done"
          />

          <TextInput
            style={styles.description}
            placeholder="Beskrivelse"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            returnKeyType="done"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.header}>Vælg start tid</Text>
            <DateTimePicker
              mode="time"
              value={formData.startTime}
              is24Hour={true}
              display="default"
              onChange={(_event, selectedDate) => {
                if (!selectedDate) return;
                handleInputChange('startTime', selectedDate);
              }}
              style={styles.timePicker}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.header}>Vælg slut tid</Text>
            <DateTimePicker
              mode="time"
              value={formData.endTime}
              is24Hour={true}
              display="default"
              onChange={(_event, selectedDate) => {
                if (!selectedDate) return;
                handleInputChange('endTime', selectedDate);
              }}
              style={styles.timePicker}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Tilføj</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  description: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#38A169',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  timePicker: {
    position: 'static',
    marginRight: 5,
  },
});

export default AddItem;
