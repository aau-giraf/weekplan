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

const CONTAINER_HEIGHT = 140;
const CONTAINER_PADDING = 12;
const ACTION_WIDTH = 70;

function LeftAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  deleteTask: () => void,
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
        style={[styles.action, { backgroundColor: "crimson" }]}
      >
        <Ionicons name="trash-outline" size={32} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

function RightAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  editActivity: () => void,
  checkActivity: () => void,
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
        style={[styles.action, { backgroundColor: "#0077b6" }]}
      >
        <Ionicons name={"pencil-outline"} size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        testID="checkActivityItemButton"
        onPress={checkActivity}
        style={[styles.action, { backgroundColor: "green" }]}
      >
        <Ionicons name={"checkmark"} size={32} color="white" />
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
  showDetails: () => void;
};

const ActivityItem: React.FC<ActivityItemProps> = ({
  time,
  label,
  isCompleted,
  deleteActivity,
  editActivity,
  checkActivity,
  showDetails,
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

  if (!isLoading && error) {
    throw new Error("Failed to fetch pictograms");
  }

  return (
      <ReanimatedSwipeable
          ref={swipeableRef}
          overshootFriction={10}
          overshootLeft={false}
          overshootRight={false}
          renderLeftActions={(prog, drag) => LeftAction(prog, drag, deleteActivity)}
          renderRightActions={(prog, drag) =>
              RightAction(
                  prog,
                  drag,
                  handleCloseOnEditTaskPress,
                  handleCloseOnCheckTaskPress,
              )
          }
          friction={2}
      >
        <Pressable onPress={showDetails}>
          <View
              style={[
                styles.taskContainer,
                { backgroundColor: isCompleted ? "#A5D6A7" : "#E3F2FD" },
              ]}
          >
            <Text style={styles.timeText}>{time.replace("-", "\n")}</Text>
            <Text style={styles.labelText} numberOfLines={2} ellipsizeMode="tail">
              {label}
            </Text>
            <View style={styles.iconContainer}>
              {data ? (
                  <Image
                      source={{ uri: data }}
                      style={{ width: 90, height: 90 }}
                      resizeMode="contain"
                  />
              ) : (
                  <Text style={styles.iconPlaceholderText}>No Icon</Text>
              )}
            </View>
          </View>
        </Pressable>
      </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: CONTAINER_PADDING,
    justifyContent: "space-between",
    height: CONTAINER_HEIGHT,
    backgroundColor: "#E3F2FD",
  },
  timeText: {
    color: "#37474F",
    fontSize: 16,
  },
  labelText: {
    color: "#37474F",
    fontSize: 16,
    textAlign: "center",
    flex: 0.6,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#FFCC80",
    justifyContent: "center",
    alignItems: "center",
  },
  iconPlaceholderText: {
    color: "#000",
    fontSize: 12,
  },
  action: {
    width: ACTION_WIDTH,
    height: 140,
    backgroundColor: "crimson",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActivityItem;
