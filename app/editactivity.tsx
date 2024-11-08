import { useLocalSearchParams } from "expo-router";
import ActivityEdit from "../components/weekoverview_components/activity_components/ActivityEdit";

type Params = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  activityId: string;
  isCompleted: string;
  date: string;
};

const EditActivity = () => {
  const { name, description, startTime, endTime, activityId, isCompleted, date } =
    useLocalSearchParams<Params>();

  if (!name || !description || !startTime || !endTime || !activityId || !isCompleted || !date) {
    throw new Error("Mangler påkrævet parameter");
  }

  if (isNaN(parseInt(activityId))) {
    throw new Error("Ugyldigt aktivitet id");
  }

  if (isCompleted !== "true" && isCompleted !== "false") {
    throw new Error("Ugyldigt isCompleted værdi");
  }

  return (
    <ActivityEdit
      title={name}
      description={description}
      startTime={new Date(startTime)}
      endTime={new Date(endTime)}
      activityId={parseInt(activityId)}
      isCompleted={isCompleted === "true"}
      date={new Date(date)}
    />
  );
};

export default EditActivity;
