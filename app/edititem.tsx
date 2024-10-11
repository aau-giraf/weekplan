import { useLocalSearchParams } from 'expo-router';
import EditTask from '../components/EditTask';

type Params = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  activityId: string;
  isCompleted: string;
};

const HomePage = () => {
  const { name, description, startTime, endTime, activityId, isCompleted } =
    useLocalSearchParams<Params>();

  if (
    !name ||
    !description ||
    !startTime ||
    !endTime ||
    !activityId ||
    !isCompleted
  ) {
    throw new Error('Missing required parameters');
  }

  if (isNaN(parseInt(activityId))) {
    throw new Error('Invalid activity id');
  }

  if (isCompleted !== 'true' && isCompleted !== 'false') {
    throw new Error('Invalid isCompleted value');
  }

  return (
    <EditTask
      title={name}
      description={description}
      startTime={new Date(startTime)}
      endTime={new Date(endTime)}
      activityId={parseInt(activityId)}
      isCompleted={isCompleted === 'true'}
    />
  );
};

export default HomePage;
