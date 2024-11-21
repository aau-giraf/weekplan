import { useLocalSearchParams } from "expo-router";
import ActivityEdit from "../../../../components/weekoverview_components/activity_components/ActivityEdit";
import { useQueryClient } from "@tanstack/react-query";
import { useDate } from "../../../../providers/DateProvider";
import { ActivityDTO, dateToQueryKey } from "../../../../hooks/useActivity";
import { Fragment } from "react";
import { SafeAreaView } from "react-native";
import { useCitizen } from "../../../../providers/CitizenProvider";
import { colors } from "../../../../utils/SharedStyles";

type Params = {
  activityId: string;
};

const EditActivity = () => {
  const { activityId } = useLocalSearchParams<Params>();
  const { citizenId } = useCitizen();
  const { selectedDate } = useDate();
  const queryClient = useQueryClient();

  if (isNaN(parseInt(activityId))) {
    throw new Error("Ugyldigt aktivitet id");
  }

  if (citizenId === null) {
    throw new Error("Borger ID er null");
  }

  const activities = queryClient.getQueryData<ActivityDTO[]>(dateToQueryKey(selectedDate, citizenId));
  const activity = activities?.find((activity) => activity.activityId === parseInt(activityId));

  if (!activity) {
    throw new Error("Aktiviteten findes ikke");
  }

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <ActivityEdit activity={activity} />
    </Fragment>
  );
};

export default EditActivity;
