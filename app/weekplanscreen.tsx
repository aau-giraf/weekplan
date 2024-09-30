import React, {useState} from "react";
import {View, StyleSheet} from "react-native";
import WeekdayHeader from "../components/WeekdayHeader";
import TaskItem from "../components/TaskItem";
import AddButton from "../components/AddButton";

const Weekplanscreen = () => {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const handleDayPress = (day: string, date: Date) => {
    const formattedDate = date.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
      setSelectedDay(day);
      setSelectedDate(formattedDate);
    console.log(`Selected day: ${day}, Date: ${formattedDate}`);
  };

    return (
        <View style={styles.container}>
            <WeekdayHeader onDayPress={handleDayPress}/>

            {selectedDay && selectedDate && (
                <AddButton label='+' pathname={"./additem"} params={{day: selectedDay, date: selectedDate}}/>
            )}
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        paddingHorizontal: 20,
    },
    contentText: {
        color: "#ECEFF1",
        marginTop: 20,
    },
});

export default Weekplanscreen;
