import { useLocalSearchParams } from "expo-router";
import ActivityEdit from "../../../../components/weekoverview_components/activity_components/ActivityEdit";
import { useQueryClient } from "@tanstack/react-query";
import { useDate } from "../../../../providers/DateProvider";
import { ActivityDTO, dateToQueryKey } from "../../../../hooks/useActivity";
import { useWeekplan } from "../../../../providers/WeekplanProvider";

type Params = {
  activityId: string;
};

const EditActivity = () => {
  const { activityId } = useLocalSearchParams<Params>();
  const { id, isCitizen } = useWeekplan();
  const { selectedDate } = useDate();
  const queryClient = useQueryClient();

  if (isNaN(parseInt(activityId))) {
    throw new Error("Ugyldigt aktivitet id");
  }

  if (id === null) {
    throw new Error("Borger ID er null");
  }

  const activities = queryClient.getQueryData<ActivityDTO[]>(dateToQueryKey(selectedDate, isCitizen, id));
  const activity = activities?.find((activity) => activity.activityId === parseInt(activityId));

  if (!activity) {
    throw new Error("Aktiviteten findes ikke");
  }

  return <ActivityEdit activity={activity} />;
};

export default EditActivity;
