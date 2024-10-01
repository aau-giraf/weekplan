import React, { useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DAYS_OF_WEEK} from "../constants/daysOfWeek";
import useWeek from "../hooks/useWeek";
import WeekdayButton from "./WeekdayButton";
import NormalCalender from "./NormalCalender";

type WeekDayHeaderProps = {
  onDayPress: (day: string, date: Date) => void;
}

const WeekDayHeader: React.FC<WeekDayHeaderProps> = ({ onDayPress }) => {
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState(currentDate.getDay());
  const { weekDates,
          goToPreviousWeek,
          goToNextWeek,
          weekNumber } = useWeek()

  return (
      <View style={styles.container}>
        {/* Week navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
            <Text style={styles.navText}>Forrige</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>Uge: {weekNumber}</Text>
          <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
            <Text style={styles.navText}>Næste</Text>
          </TouchableOpacity>
        </View>

        {/* Day of week buttons */}
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day, index) => (
              <WeekdayButton
                    key={day.id}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    onPress={onDayPress}
                    date={weekDates[index]}
                    day={day}
              />
          ))}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#F2F5FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#B0BEC5',
    borderRadius: 5,
  },
  navText: {
    color: '#263238',
    fontSize: 16,
  },
  weekText: {
    color: '#263238',
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});

export default WeekDayHeader;