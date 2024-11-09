import React from "react";
import usePictogram from "../../../hooks/usePictogram";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, SharedStyles } from "../../../utils/SharedStyles";

type ActivityItemProps = {
  time: string;
  isCompleted: boolean;
  setImageUri: React.Dispatch<React.SetStateAction<string | undefined>>;
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
const ActivityItem: React.FC<ActivityItemProps> = ({ time, isCompleted, setImageUri, setModalVisible }) => {
  const { useFetchPictograms } = usePictogram(27575);
  const { data, error, isLoading } = useFetchPictograms;

  const handleImagePress = (uri: string) => {
    setImageUri(uri);
    setModalVisible(true);
  };

  if (!isLoading && error) {
    throw new Error("Fejl kunne ikke hente piktogramerne");
  }

  return (
    <View
      style={[
        styles.taskContainer,
        {
          backgroundColor: isCompleted ? colors.lightGreen : colors.lightBlue,
        },
      ]}>
      <Text style={styles.timeText}>{time}</Text>
      <View style={styles.iconContainer}>
        {data ? (
          <Pressable onPress={() => handleImagePress(data)}>
            <Image
              source={{ uri: data }}
              style={{ width: ScaleSizeH(150), height: ScaleSizeH(150) }}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <Text style={styles.iconPlaceholderText}>No Icon</Text>
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
    backgroundColor: colors.orange,
  },
  iconPlaceholderText: {
    fontSize: ScaleSize(0),
    color: colors.backgroundBlack,
  },
});

export default ActivityItem;
