import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Ændre Aktivitet</Text>
      <View>
        <TextInput
          value={form.title}
          placeholder="Navn"
          style={styles.input}
          onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
        />
      </View>
      <View>
        <TextInput
          value={form.description}
          multiline
          placeholder="Beskrivelse"
          style={[styles.input, { height: 80 }]}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, description: text }))
          }
        />
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Vælg start tid</Text>
        <DateTimePicker
          mode="time"
          value={form.startTime}
          maximumDate={form.endTime}
          is24Hour={true}
          display="default"
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange('startTime', selectedDate);
          }}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Vælg slut tid</Text>
        <DateTimePicker
          mode="time"
          value={form.endTime}
          minimumDate={form.startTime}
          is24Hour={true}
          display="default"
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange('endTime', selectedDate);
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Dato for aktivitet</Text>
        <DateTimePicker
          value={form.date}
          mode={'date'}
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange('date', selectedDate);
          }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tilføj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#f9f9f9',
    height: '100%',
    flexGrow: 1,
    gap: 15,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 'auto',
    alignItems: 'center',
    backgroundColor: '#38A169',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default EditTask;
