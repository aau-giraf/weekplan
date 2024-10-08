import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem'; // Import your existing ActivityItem component
import useActivity from "../hooks/useActivity";

type Activity =  {
    activityId: number;
    citizenId: number;
    date: string;
    description: string;
    endTime: string;
    name: string;
    startTime: string;
}

const ActivityItemList = ({ id }: { id: number }) => {
    const { useFetchActivities } = useActivity({ date: new Date() });
    const { data, error, isLoading } = useFetchActivities(id);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error fetching activities: {error.message}</Text>;
    }

    const renderActivityItem = ({ item }: { item: Activity }) => (
        <ActivityItem
            time={`${item.startTime} - ${item.endTime}`}
            label={item.name}
            deleteTask={() => handleDeleteTask(item.activityId)}
            editTask={() => handleEditTask(item.activityId)}
            checkTask={() => handleCheckTask(item.activityId)}
        />
    );

    const handleDeleteTask = (id: number) => {
        console.log(`Delete activity with id: ${id}`);
    };

    const handleEditTask = (id: number) => {
        console.log(`Edit activity with id: ${id}`);
    };

    const handleCheckTask = (id: number) => {
        console.log(`Check activity with id: ${id}`);
    };

    return (
        <View style={styles.container}>
            {data && data.length > 0 ? (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.activityId.toString()}
                    renderItem={renderActivityItem}
                />
            ) : (
                <Text>No activities found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default ActivityItemList;
