import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ActivityItem from './ActivityItem'; // Import your existing ActivityItem component
import useActivity from '../hooks/useActivity';
import { useDate } from '../providers/DateProvider';

type Activity = {
  activityId: number;
  citizenId: number;
  date: string;
  description: string;
  endTime: string;
  name: string;
  startTime: string;
};

const ActivityItemList = ({ id }: { id: number }) => {
  const { selectedDate } = useDate();
  const { useFetchActivities, deleteActivity } = useActivity({
    date: selectedDate,
  });
  const { data, error, isLoading, refetch } = useFetchActivities(id);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error fetching activities: {error.message}</Text>;
  }

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <ActivityItem
      time={`${item.startTime}-${item.endTime}`}
      label={item.name}
      deleteTask={() => handleDeleteTask(item.activityId)}
      editTask={() => handleEditTask(item.activityId)}
      checkTask={() => handleCheckTask(item.activityId)}
    />
  );

  const handleDeleteTask = async (id: number) => {
    console.log(`Delete activity with id: ${id}`);
    await deleteActivity.mutateAsync(id);
  };

  const handleEditTask = (id: number) => {
    console.log(`Edit activity with id: ${id}`);
  };

  const handleCheckTask = (id: number) => {
    console.log(`Check activity with id: ${id}`);
  };

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
