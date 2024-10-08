import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerColumnProps {
  title: string;
  weeksOrYear: number[];
  selectedValue: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>;
}

const PickerColumn: React.FC<PickerColumnProps> = ({
  title,
  weeksOrYear,
  selectedValue,
  setSelectedValue,
}) => (
  <View style={styles.pickerColumn}>
    <Text style={styles.pickerTitle}>{title}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => setSelectedValue(itemValue)}
      style={styles.picker}
      itemStyle={styles.pickerItem}>
      {weeksOrYear.map((item) => (
        <Picker.Item key={item} label={item.toString()} value={item} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  pickerColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: 150,
  },
  pickerItem: {
    fontSize: 18,
  },
});

export default PickerColumn;
