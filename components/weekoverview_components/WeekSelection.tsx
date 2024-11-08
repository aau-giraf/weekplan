import React, { useState } from "react";
import { View, Modal, Button, StyleSheet } from "react-native";
import getWeekNumber from "../../utils/getWeekNumber";
import getNumberOfWeeksInYear from "../../utils/getNumberOfWeeksInYear";
import PickerColumn from "../PickerColumn";
import { useDate } from "../../providers/DateProvider";
import { colors, ScaleSize, ScaleSizeW, SharedStyles } from "../../utils/SharedStyles";
import getMonthsFromDates from "../../utils/getMonthsFromDate";

type WeekSelectionProps = {};

const getWeeks = (year: number) => {
  const weeks = [];
  for (let i = 1; i <= getNumberOfWeeksInYear(year); i++) {
    weeks.push(i);
  }
  return weeks;
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 1; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
};

/**
 * WeekSelection component allows users to select a specific week and year.
 *
 * @property {boolean} modalVisible - State to control the visibility of the modal.
 * @property {number} selectedWeek - State to store the selected week number.
 * @property {number} selectedYear - State to store the selected year.
 * @returns {JSX.Element} The WeekSelection component.
 */
const WeekSelection: React.FC<WeekSelectionProps> = () => {
  const currentDate = new Date();
  const { setWeekAndYear, weekNumber, weekDates } = useDate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(currentDate));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const weeks = getWeeks(selectedYear);
  const years = getYears();

  const monthString = getMonthsFromDates(weekDates[0], weekDates[6]);

  const handleWeekSelection = () => {
    setWeekAndYear(selectedWeek, selectedYear);
    setModalVisible(false);
  };

  return (
    <View style={styles.weekSelection}>
      <Button title={`Uge ${weekNumber} \n ${monthString}`} onPress={() => setModalVisible(true)} />

      {/* Modal for Week/Year Picker */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <PickerColumn
              title="Vælg år:"
              weeksOrYear={years}
              selectedValue={selectedYear}
              setSelectedValue={setSelectedYear}
            />
            <PickerColumn
              title="Vælg uge:"
              weeksOrYear={weeks}
              selectedValue={selectedWeek}
              setSelectedValue={setSelectedWeek}
            />
            <View style={styles.button}>
              <Button title="Færdig" onPress={handleWeekSelection} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  weekSelection: {
    alignItems: "center",
    padding: ScaleSize(10),
  },
  weekText: {
    padding: ScaleSize(5),
    fontSize: ScaleSize(48),
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.backgroundBlack,
  },
  pickerContainer: {
    ...SharedStyles.flexRow,
    marginLeft: ScaleSizeW(10),
    marginRight: ScaleSizeW(10),
    padding: ScaleSize(50),
    borderRadius: 25,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  button: {
    width: ScaleSizeW(500),
    alignSelf: "center",
    position: "absolute",
    bottom: ScaleSize(5),
  },
});

export default WeekSelection;
