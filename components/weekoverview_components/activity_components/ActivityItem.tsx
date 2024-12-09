import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, SharedStyles } from "../../../utils/SharedStyles";
import { ActivityDTO } from "../../../hooks/useActivity";
import { BASE_URL } from "../../../utils/globals";

type ActivityItemProps = {
  item: ActivityDTO;
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Component representing an activity item with various interactive features. Used in the WeekOverview screen.
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.time - The time associated with the activity.
 * @param {boolean} props.isCompleted - Flag indicating if the activity is completed.
 * @param {Function} props.deleteActivity - Function to delete the activity.
 * @param {Function} props.editActivity - Function to edit the activity.
 * @param {Function} props.checkActivity - Function to mark the activity as checked.
 * @param {Function} props.setImageUri - Function to set the image URI.
 * @param {Function} props.setModalVisible - Function to set the modal visibility.
 * @returns {JSX.Element} The rendered activity item component.
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ item, setImageUri, setModalVisible }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const handleImagePress = (uri: string) => {
    setImageUri(uri);
    setModalVisible(true);
  };

  const uri = `${BASE_URL}/${item.pictogram?.pictogramUrl}`;

  return (
    <View
      style={[
        styles.taskContainer,
        {
          backgroundColor: item.isCompleted ? colors.lightGreen : colors.lightBlue,
        },
      ]}>
      <Text style={styles.timeText}>{item.startTime + "\n" + item.endTime}</Text>
      <View style={styles.iconContainer}>
        {!imageError ? (
          <Pressable onPress={() => handleImagePress(uri)}>
            <Image
              source={{ uri }}
              style={{ width: ScaleSizeH(200), height: ScaleSizeH(200) }}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          </Pressable>
        ) : (
          <Text style={styles.iconPlaceholderText}>Intet piktogram</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  taskContainer: {
    ...SharedStyles.flexRow,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: colors.lightBlue,
  },
  timeText: {
    fontSize: ScaleSize(36),
    color: colors.black,
  },
  iconContainer: {
    ...SharedStyles.trueCenter,
    width: ScaleSize(200),
    height: ScaleSize(200),
    borderRadius: 150,
    marginVertical: ScaleSize(10),
    backgroundColor: colors.orange,
    overflow: "hidden",
  },
  iconPlaceholderText: {
    fontSize: ScaleSize(30),
    color: colors.backgroundBlack,
  },
});

export default ActivityItem;
