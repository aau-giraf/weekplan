import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "../../ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import usePictogram from "../../../hooks/usePictogram";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../../../utils/SharedStyles";

const CONTAINER_HEIGHT = ScaleSizeH(200);
const CONTAINER_PADDING = ScaleSize(10);
const ACTION_WIDTH = ScaleSizeW(130);

/**
 * LeftAction component for handling swipe-to-delete functionality.
 *
 * @param {SharedValue<number>} prog - Shared value for progress.
 * @param {SharedValue<number>} drag - Shared value for drag position.
 * @param {() => void} deleteTask - Callback function to delete the task.
 * @returns {JSX.Element} A styled animated view with a delete button.
 */
function LeftAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  deleteTask: () => void
) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - ACTION_WIDTH }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <TouchableOpacity
        testID="deleteActivityItemButton"
        onPress={deleteTask}
        style={[styles.action, { backgroundColor: colors.crimson }]}>
        <Ionicons
          name="trash-outline"
          size={ScaleSize(48)}
          color={colors.white}
        />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

/**
 * Renders the right action buttons for an activity item with animation.
 *
 * @param {SharedValue<number>} prog - The shared value for progress.
 * @param {SharedValue<number>} drag - The shared value for drag position.
 * @param {() => void} editActivity - Callback function to edit the activity.
 * @param {() => void} checkActivity - Callback function to check the activity.
 * @returns {JSX.Element} The animated view containing action buttons.
 */
function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  editActivity: () => void,
  checkActivity: () => void
) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + ACTION_WIDTH * 2 }],
    };
  });

  return (
    <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
      <TouchableOpacity
        testID="editActivityItemButton"
        onPress={editActivity}
        style={[styles.action, { backgroundColor: colors.blue }]}>
        <Ionicons
          name={"pencil-outline"}
          size={ScaleSize(48)}
          color={colors.white}
        />
      </TouchableOpacity>

      <TouchableOpacity
        testID="checkActivityItemButton"
        onPress={checkActivity}
        style={[styles.action, { backgroundColor: colors.green }]}>
        <Ionicons
          name={"checkmark"}
          size={ScaleSize(48)}
          color={colors.white}
        />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

type ActivityItemProps = {
  time: string;
  label: string;
  isCompleted: boolean;
  deleteActivity: () => void;
  editActivity: () => void;
  checkActivity: () => void;
  setImageUri: React.Dispatch<React.SetStateAction<string | undefined>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Component representing an activity item with various interactive features. Used in the WeekOverview screen.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.time - The time associated with the activity.
 * @param {string} props.label - The label or name of the activity.
 * @param {boolean} props.isCompleted - Flag indicating if the activity is completed.
 * @param {Function} props.deleteActivity - Function to delete the activity.
 * @param {Function} props.editActivity - Function to edit the activity.
 * @param {Function} props.checkActivity - Function to mark the activity as checked.
 * @param {Function} props.showDetails - Function to show details of the activity.
 * @param {Function} props.setImageUri - Function to set the image URI.
 * @param {Function} props.setModalVisible - Function to set the modal visibility.
 * @returns {JSX.Element} The rendered activity item component.
 */
const ActivityItem: React.FC<ActivityItemProps> = ({
  time,
  label,
  isCompleted,
  deleteActivity,
  editActivity,
  checkActivity,
  setImageUri,
  setModalVisible,
}) => {
  const { useFetchPictograms } = usePictogram(27575);
  const { data, error, isLoading } = useFetchPictograms;
  const swipeableRef = React.useRef<SwipeableMethods>(null);

  const handleCloseOnCheckTaskPress = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    checkActivity();
  };

  const handleCloseOnEditTaskPress = () => {
    setTimeout(() => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    }, 300);

    editActivity();
  };

  const handleImagePress = (uri: string) => {
    setImageUri(uri);
    setModalVisible(true);
  };

  if (!isLoading && error) {
    throw new Error("Fejl kunne ikke hente piktogramerne");
  }

  return (
    <>
      <ReanimatedSwipeable
        ref={swipeableRef}
        overshootFriction={10}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={(prog, drag) =>
          LeftAction(prog, drag, deleteActivity)
        }
        renderRightActions={(prog, drag) =>
          RightAction(
            prog,
            drag,
            handleCloseOnEditTaskPress,
            handleCloseOnCheckTaskPress
          )
        }
        friction={2}>
        <View
          style={[
            styles.taskContainer,
            {
              backgroundColor: isCompleted
                ? colors.lightGreen
                : colors.lightBlue,
            },
          ]}>
          <Text style={styles.timeText}>{time.replace("-", "\n")}</Text>
          <Text style={styles.labelText} numberOfLines={2} ellipsizeMode="tail">
            {label}
          </Text>
          <View style={styles.iconContainer}>
            {data ? (
              <Pressable onPress={() => handleImagePress(data)}>
                <Image
                  source={{ uri: data }}
                  style={{ width: ScaleSizeW(90), height: ScaleSizeH(90) }}
                  resizeMode="contain"
                />
              </Pressable>
            ) : (
              <Text style={styles.iconPlaceholderText}>No Icon</Text>
            )}
          </View>
        </View>
      </ReanimatedSwipeable>
    </>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    ...SharedStyles.flexRow,
    width: "100%",
    alignItems: "center",
    height: CONTAINER_HEIGHT,
    padding: CONTAINER_PADDING,
    justifyContent: "space-between",
    backgroundColor: colors.lightBlue,
  },
  timeText: {
    fontSize: ScaleSize(28),
    color: colors.black,
  },
  labelText: {
    flex: 0.6,
    fontSize: ScaleSize(28),
    textAlign: "center",
    color: colors.black,
  },
  iconContainer: {
    ...SharedStyles.trueCenter,
    width: ScaleSizeW(160),
    height: ScaleSizeH(160),
    borderRadius: ScaleSize(150),
    backgroundColor: colors.orange,
  },
  iconPlaceholderText: {
    fontSize: ScaleSize(28),
    color: colors.backgroundBlack,
  },
  action: {
    ...SharedStyles.trueCenter,
    height: CONTAINER_HEIGHT,
    width: ACTION_WIDTH,
    backgroundColor: colors.crimson,
  },
});

export default ActivityItem;
