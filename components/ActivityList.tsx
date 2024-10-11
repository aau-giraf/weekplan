import { TaskDTO } from "../types/TaskDTO";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ActivityListItem } from "./ActivityListItem";

type ActivityListProps = {
  activities: TaskDTO[];
};

export const ActivityList = (props: ActivityListProps) => {
  const [selectedActivities, setSelectedActivities] = useState<boolean[]>(
    () => {
      return new Array(props.activities.length).fill(true);
    },
  );

  function toggleSelected(index: number) {
    const updatedActivities = [...selectedActivities];
    updatedActivities[index] = !updatedActivities[index];
    setSelectedActivities(updatedActivities);
  }

  function findSelected(): TaskDTO[] {
    return props.activities.filter(
      (_activity, index) => selectedActivities[index],
    );
  }

  useEffect(() => {
    setSelectedActivities(new Array(props.activities.length).fill(true));
  }, [props.activities]);

  return (
    <ScrollView style={styles.activityView} key={props.activities.length}>
      {props.activities.map((activity, index) => (
        <ActivityListItem
          activity={activity}
          index={index}
          toggleCallback={toggleSelected}
          selectedActivities={selectedActivities}
          key={index.toString()}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityView: {
    padding: 5,
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
