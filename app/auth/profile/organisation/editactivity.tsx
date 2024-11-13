import { useLocalSearchParams } from "expo-router";
import ActivityEdit from "../../../../components/weekoverview_components/activity_components/ActivityEdit";
import { useQueryClient } from "@tanstack/react-query";
import { useDate } from "../../../../providers/DateProvider";
import { ActivityDTO, dateToQueryKey } from "../../../../hooks/useActivity";
import { Fragment } from "react";
import { SafeAreaView } from "react-native";

type Params = {
  activityId: string;
};

const EditActivity = () => {
  const { activityId } = useLocalSearchParams<Params>();
  const queryClient = useQueryClient();
  const { selectedDate } = useDate();

  if (isNaN(parseInt(activityId))) {
    throw new Error("Ugyldigt aktivitet id");
  }

  const activities = queryClient.getQueryData<ActivityDTO[]>(dateToQueryKey(selectedDate));
  const activity = activities?.find((activity) => activity.activityId === parseInt(activityId));

  if (!activity) {
    throw new Error("Aktiviteten findes ikke");
  }

  return (
    <Fragment>
      <SafeAreaView />
      <ActivityEdit activity={activity} />
    </Fragment>
  );
};

export default EditActivity;
