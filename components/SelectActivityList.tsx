import { ActivityDTO } from "../DTO/activityDTO";
import formatTime from "../utils/formatTime";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

type SelectActivityListProps = {
  activities: ActivityDTO[];
  toggleCallback: (index: number) => boolean;
  error: Error | null;
};

type SelectActivityListItemProps = {
  activity: ActivityDTO;
  index: number;
  toggleCallback: (index: number) => boolean;
};

export const SelectActivityList = (props: SelectActivityListProps) => {
  if (props.error) {
    return <Text>Der opstod et problem )=</Text>;
  }
  return (
    <ScrollView style={styles.activityView}>
      {props.activities.map((activity, index) => (
        <ActivityListItem
          activity={activity}
          index={index}
          toggleCallback={props.toggleCallback}
          key={index.toString()}
        />
      ))}
    </ScrollView>
  );
};

const ActivityListItem = (props: SelectActivityListItemProps) => {
  const activityName = props.activity.name
    ? props.activity.name.length <= 27
      ? props.activity.name
      : props.activity.name.substring(0, 25).concat("...")
    : "";
  const startTime = formatTime(new Date(props.activity.startTime));
  const endTime = formatTime(new Date(props.activity.endTime));
  const [isSelected, setSelected] = React.useState(true);

  return (
    <TouchableOpacity
      onPress={() => setSelected(props.toggleCallback(props.index))}
      key={props.index}
    >
      <View
        style={[styles.activityEntry, { borderLeftWidth: isSelected ? 1 : 0 }]}
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
  activityView: {
    padding: 5,
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
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
