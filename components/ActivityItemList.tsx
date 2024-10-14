import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ActivityItem from './ActivityItem';
import useActivity from '../hooks/useActivity';
import { useDate } from '../providers/DateProvider';
import { ActivityDTO } from '../DTO/activityDTO';
import { useRouter } from 'expo-router';

interface AddButtonProps {
  pathname: `./${string}` | `../${string}` | `${string}:${string}`;
}

const ActivityItemList: React.FC<AddButtonProps>= ({pathname}) => {
  const { selectedDate } = useDate();
  const router = useRouter();
  const { useFetchActivities, useDeleteActivity, useToggleActivityStatus } = useActivity({
    date: selectedDate,
  });
  const { data, error, isLoading, refetch } = useFetchActivities;

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error fetching activities: {error.message}</Text>;
  }
  const handleDetails = (activityId: number) => {
    router.push({pathname: pathname, params: {activityId}});
  };

  const renderActivityItem = ({ item }: { item: ActivityDTO }) => (
    <ActivityItem
      time={`${item.startTime}-${item.endTime}`}
      label={item.name}
      isCompleted={item.isCompleted}
      deleteTask={() => handleDeleteTask(item.activityId)}
      editTask={() => handleEditTask(item.activityId)}
      checkTask={() => handleCheckTask(item.activityId, item.isCompleted)}
    />
  );


  const handleDeleteTask = async (id: number) => {
    await useDeleteActivity.mutateAsync(id);
  };

  const handleEditTask = (id: number) => {
    console.log(`Edit activity with id: ${id}`);
  };

  const handleCheckTask = async (id: number, isCompleted: boolean) => {
    await useToggleActivityStatus.mutateAsync({ id, isCompleted: !isCompleted });
  };

  const renderActivityItem = ({ item }: { item: ActivityDTO }) => (
      <ActivityItem
          time={`${item.startTime}-${item.endTime}`}
          label={item.name}
          deleteTask={() => handleDeleteTask(item.activityId)}
          editTask={() => handleEditTask(item.activityId)}
          checkTask={() => handleCheckTask(item.activityId)}
          showDetails={() => handleDetails(item.activityId)}
      />
  );

  return (
      <FlatList
          data={data}
          onRefresh={async () => await refetch()}
          refreshing={isLoading}
          ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
          keyExtractor={(item) => item.activityId.toString()}
          renderItem={renderActivityItem}
          ListEmptyComponent={() => <Text>No activities found</Text>}
      />
  );
};

export default ActivityItemList;
