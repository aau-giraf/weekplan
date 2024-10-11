import { TaskDTO } from "../types/TaskDTO";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

type ActivityListItemProps = {
  activity: TaskDTO;
  index: number;
  toggleCallback: (index: number) => void;
  selectedActivities: boolean[];
};

export const ActivityListItem = (props: ActivityListItemProps) => {
  function formatTime(date: Date) {
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const activityName = props.activity.name
    ? props.activity.name.length <= 27
      ? props.activity.name
      : props.activity.name.substring(0, 25).concat("...")
    : "";
  const startTime = formatTime(props.activity.startTime);
  const endTime = formatTime(props.activity.endTime);

  return (
    <TouchableOpacity onPress={() => props.toggleCallback(props.index)}>
      <View
        style={[
          styles.activityEntry,
          { borderLeftWidth: props.selectedActivities[props.index] ? 1 : 0 },
        ]}
        key={props.index.toString()}
      >
        <Text style={{ width: "70%" }}>{activityName}</Text>
        <Text style={{ width: "30%", textAlign: "center" }}>
          {startTime + "\n" + endTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityEntry: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 0,
    borderLeftWidth: 1,
    borderColor: "blue",
    paddingLeft: 5,
  },
});
