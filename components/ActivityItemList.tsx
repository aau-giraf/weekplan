import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ActivityItem from './ActivityItem';
import useActivity from '../hooks/useActivity';
import { useDate } from '../providers/DateProvider';
import { ActivityDTO, FullActivityDTO } from '../DTO/activityDTO';
import { router } from 'expo-router';
import { useCitizen } from '../providers/CitizenProvider';
import dateAndTimeToISO from '../utils/dateAndTimeToISO';

const ActivityItemList = () => {
  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { useFetchActivities, useDeleteActivity, useToggleActivityStatus } =
    useActivity({
      date: selectedDate,
    });
  const { data, error, isLoading, refetch } = useFetchActivities;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Error fetching activities: {error.message}</Text>;
  }
  const handleDetails = (activityId: number) => {
    router.push({ pathname: '/viewitem', params: { activityId } });
  };

  const renderActivityItem = ({ item }: { item: ActivityDTO }) => {
    const handleEditTask = () => {
      const data: FullActivityDTO = {
        citizenId: citizenId,
        name: item.name,
        description: item.description,
        activityId: item.activityId,
        date: dateAndTimeToISO(item.date).toISOString(),
        endTime: dateAndTimeToISO(item.date, item.endTime).toISOString(),
        startTime: dateAndTimeToISO(item.date, item.startTime).toISOString(),
        isCompleted: item.isCompleted,
      };
      router.push({
        pathname: './edititem',
        params: { ...data, isCompleted: item.isCompleted.toString() },
      });
    };

    return (
      <ActivityItem
        isCompleted={item.isCompleted}
        time={`${item.startTime}-${item.endTime}`}
        label={item.name}
        deleteTask={() => handleDeleteTask(item.activityId)}
        editTask={() => handleEditTask()}
        checkTask={() => handleCheckTask(item.activityId, item.isCompleted)}
        showDetails={() => handleDetails(item.activityId)}
      />
    );
  };

  const handleDeleteTask = async (id: number) => {
    await useDeleteActivity.mutateAsync(id);
  };

  const handleCheckTask = async (id: number, isCompleted: boolean) => {
    await useToggleActivityStatus.mutateAsync({
      id,
      isCompleted: !isCompleted,
    });
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
