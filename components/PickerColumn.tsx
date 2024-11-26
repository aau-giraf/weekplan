import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ScaleSize, ScaleSizeH, ScaleSizeW } from "../utils/SharedStyles";

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
      style={{ width: ScaleSizeW(250) }}
      itemStyle={{ fontSize: ScaleSize(28) }}>
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
    fontSize: ScaleSize(28),
    fontWeight: "bold",
    marginBottom: ScaleSizeH(10),
  },
});

export default PickerColumn;
