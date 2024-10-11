import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDate } from '../providers/DateProvider';
import useActivity from '../hooks/useActivity';
import { useCitizen } from '../providers/CitizenProvider';
import { router } from 'expo-router';

type EditTaskButtonProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  activityId: number;
  isCompleted: boolean;
};

type SubmitProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  date: Date;
};

const EditTask = ({
  title,
  description,
  startTime,
  endTime,
  activityId,
  isCompleted,
}: EditTaskButtonProps) => {
  const [form, setForm] = useState<SubmitProps>({
    title: title,
    description: description,
    startTime: startTime,
    endTime: endTime,
    date: new Date(endTime),
  });

  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { updateActivity } = useActivity({ date: selectedDate });

  const handleInputChange = (
    field: keyof SubmitProps,
    value: string | Date
  ) => {
    setForm((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const startTimeHHMM = form.startTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTimeHHMM = form.endTime.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await updateActivity.mutateAsync({
      activityId: activityId,
      citizenId: citizenId,
      date: form.date.toDateString(),
      name: form.title,
      description: form.description,
      startTime: startTimeHHMM,
      endTime: endTimeHHMM,
      isCompleted: isCompleted,
    });
    router.back();
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Ændre Aktivitet</Text>
      <TextInput
        value={form.title}
        style={styles.input}
        onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
      />
      <TextInput
        value={form.description}
        style={styles.input}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, description: text }))
        }
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Vælg start tid</Text>
        <DateTimePicker
          mode="time"
          value={form.startTime}
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
          value={form.endTime}
          is24Hour={true}
          display="default"
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange('endTime', selectedDate);
          }}
          style={styles.timePicker}
        />
      </View>
      <View>
        <Text style={styles.header}>Dato for aktivitet</Text>
        <DateTimePicker
          value={form.date}
          mode={'date'}
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange('date', selectedDate);
          }}
          style={styles.timePicker}
        />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    maxHeight: '100%',
    maxWidth: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
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

export default EditTask;
