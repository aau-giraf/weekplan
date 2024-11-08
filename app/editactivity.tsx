import { useLocalSearchParams } from "expo-router";
import ActivityEdit from "../components/weekoverview_components/activity_components/ActivityEdit";
import { useQueryClient } from "@tanstack/react-query";
import { useDate } from "../providers/DateProvider";
import { dateToQueryKey } from "../hooks/useActivity";
import { ActivityDTO } from "../DTO/activityDTO";

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

  const activities = queryClient.getQueryData<ActivityDTO[]>(
    dateToQueryKey(selectedDate)
  );

  const activity = activities?.find(
    (activity) => activity.activityId === parseInt(activityId)
  );

  if (!activity) {
    throw new Error("Aktiviteten findes ikke");
  }

  return <ActivityEdit activity={activity} />;
};

export default EditActivity;
