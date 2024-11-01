import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native-size-scaling";
import { Picker } from "@react-native-picker/picker";

interface PickerColumnProps {
  title: string;
  weeksOrYear: number[];
  selectedValue: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * PickerColumn component renders a column with a title and a picker.
 *
 * @param {string} title - The title displayed above the picker.
 * @param {Array<number | string>} weeksOrYear - The array of items to be displayed in the picker.
 * @param {number | string} selectedValue - The currently selected value in the picker.
 * @param {function} setSelectedValue - The function to update the selected value.
 *
 * @returns {JSX.Element} The rendered PickerColumn component.
 */
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
    display: "flex",
    alignItems: "center",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
