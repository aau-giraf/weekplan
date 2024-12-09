import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActivityItem from "./ActivityItem";
import useActivity, { ActivityDTO } from "../../../hooks/useActivity";
import { useDate } from "../../../providers/DateProvider";
import { router } from "expo-router";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../utils/SharedStyles";
import { useToast } from "../../../providers/ToastProvider";
import SwipeableList, { Action } from "../../swipeablelist/SwipeableList";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

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
  const { useFetchActivities, useDeleteActivity, useToggleActivityStatus } = useActivity({
    date: selectedDate,
  });
  const { data, error, isLoading, refetch } = useFetchActivities;
  const { addToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const renderActivityItem = useCallback(
    (item: ActivityDTO) => (
      <ActivityItem item={item} setImageUri={setImageUri} setModalVisible={setModalVisible} />
    ),
    [setImageUri, setModalVisible]
  );

  const handleDeleteActivity = useCallback(
    async (id: number) => {
      await useDeleteActivity.mutateAsync(id);
    },
    [useDeleteActivity]
  );

  const handleEditTask = useCallback((item: ActivityDTO) => {
    router.push({
      pathname: "/auth/profile/organisation/editactivity",
      params: { activityId: item.activityId.toString() },
    });
  }, []);

  const handleCheckActivity = useCallback(
    (id: number, isCompleted: boolean) => {
      useToggleActivityStatus
        .mutateAsync({
          id,
          isCompleted: !isCompleted,
        })
        .catch((error) => addToast({ message: (error as any).message, type: "error" }));
    },
    [useToggleActivityStatus, addToast]
  );

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text>Fejl med at hente aktiviteter {error?.message}</Text>
      </View>
    );
  }

  const rightActions: Action<ActivityDTO>[] = [
    {
      icon: "pencil-outline",
      color: colors.blue,
      onPress: (item) => handleEditTask(item),
      closeDelay: 500,
    },
    {
      icon: "checkmark",
      color: colors.green,
      onPress: (item) => handleCheckActivity(item.activityId, item.isCompleted),
    },
  ];

  const leftActions: Action<ActivityDTO>[] = [
    {
      icon: "trash",
      color: colors.crimson,
      onPress: (item) => handleDeleteActivity(item.activityId),
    },
  ];

  return (
    <>
      <SwipeableList
        items={data}
        renderItem={({ item }) => renderActivityItem(item)}
        keyExtractor={(item) => item.activityId.toString()}
        flatListProps={{
          ListEmptyComponent: <Text>Ingen aktiviteter fundet</Text>,
          refreshing: isLoading,
          onRefresh: async () => await refetch(),
        }}
        rightActions={rightActions}
        leftActions={leftActions}
      />
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: ScaleSizeW(750), height: ScaleSizeH(750) }}
                  resizeMode="contain"
                />
              ) : (
                <Text>Intet billede for piktogram</Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Luk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    marginTop: ScaleSizeH(30),
    width: ScaleSizeW(300),
    height: ScaleSizeH(75),
    borderRadius: 5,
    marginBottom: ScaleSizeH(20),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: ScaleSize(48),
    color: colors.white,
  },
});

export default ActivityItemList;
