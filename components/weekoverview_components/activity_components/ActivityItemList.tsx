import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ActivityItem from "./ActivityItem";
import useActivity from "../../../hooks/useActivity";
import { useDate } from "../../../providers/DateProvider";
import { ActivityDTO, FullActivityDTO } from "../../../DTO/activityDTO";
import { router } from "expo-router";
import { useCitizen } from "../../../providers/CitizenProvider";
import dateAndTimeToISO from "../../../utils/dateAndTimeToISO";
import Animated, { LinearTransition } from "react-native-reanimated";
import { rem, colors, SharedStyles } from "../../../utils/SharedStyles";

/**
 * Component that renders a list of activities for a selected date.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - Fetches activities based on the selected date and citizen ID.
 * - Handles loading and error states.
 * - Allows editing, deleting, and toggling the status of activities.
 * - Displays a modal with an image when an activity item is clicked.
 */
const ActivityItemList = () => {
  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { useFetchActivities, useDeleteActivity, useToggleActivityStatus } =
    useActivity({
      date: selectedDate,
    });
  const { data, error, isLoading, refetch } = useFetchActivities;
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string>();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Fejl med at hente aktiviteter: {error.message}</Text>;
  }
  const handleDetails = (activityId: number) => {
    router.push({ pathname: "../../viewactivity", params: { activityId } });
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
        pathname: "./editactivity",
        params: { ...data, isCompleted: item.isCompleted.toString() },
      });
    };

    return (
      <ActivityItem
        isCompleted={item.isCompleted}
        time={`${item.startTime}-${item.endTime}`}
        label={item.name}
        deleteActivity={() => handleDeleteActivity(item.activityId)}
        editActivity={() => handleEditTask()}
        checkActivity={() =>
          handleCheckActivity(item.activityId, item.isCompleted)
        }
        showDetails={() => handleDetails(item.activityId)}
        setImageUri={setImageUri}
        setModalVisible={setModalVisible}
      />
    );
  };

  const handleDeleteActivity = async (id: number) => {
    await useDeleteActivity.mutateAsync(id);
  };

  const handleCheckActivity = async (id: number, isCompleted: boolean) => {
    await useToggleActivityStatus.mutateAsync({
      id,
      isCompleted: !isCompleted,
    });
  };

  return (
    <>
      <Animated.FlatList
        data={data}
        onRefresh={async () => await refetch()}
        itemLayoutAnimation={LinearTransition}
        refreshing={isLoading}
        ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
        keyExtractor={(item) => item.activityId.toString()}
        renderItem={renderActivityItem}
        ListEmptyComponent={() => <Text>Ingen aktiviteter fundet</Text>}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Luk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...SharedStyles.trueCenter,
    flex: 1,
    backgroundColor: colors.backgroundBlack,
  },
  modalContent: {
    ...SharedStyles.trueCenter,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  closeButtonText: {
    fontSize: rem(1),
    color: colors.white,
  },
});

export default ActivityItemList;
