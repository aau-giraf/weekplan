import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedSwipeable from "./ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const CONTAINER_HEIGHT = 80;
const CONTAINER_PADDING = 12;
const ACTION_WIDTH = 70;

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
  editTask: () => void,
  checkTask: () => void
) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + ACTION_WIDTH * 2 }],
    };
  });

  return (
    <Reanimated.View style={[styleAnimation, { flexDirection: "row" }]}>
      <TouchableOpacity
        onPress={editTask}
        style={[styles.action, { backgroundColor: "#0077b6" }]}
      >
        <Ionicons name={"pencil-outline"} size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={checkTask}
        style={[styles.action, { backgroundColor: "green" }]}
      >
        <Ionicons name={"checkmark"} size={32} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
}

interface TaskItemProps {
  time: string;
  label: string;
  deleteTask: () => void;
  editTask: () => void;
  checkTask: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  time,
  label,
  deleteTask,
  editTask,
  checkTask,
}) => {
  return (
    <ReanimatedSwipeable
      renderLeftActions={(prog, drag) => LeftAction(prog, drag, deleteTask)}
      renderRightActions={(prog, drag) =>
        RightAction(prog, drag, editTask, checkTask)
      }
      friction={2}
    >
      <View style={styles.taskContainer}>
        <Text style={styles.timeText}>{time.replace("-", "\n")}</Text>
        <Text style={styles.labelText} numberOfLines={2} ellipsizeMode="tail">
          {label}
        </Text>
        <View style={styles.iconContainer}>
          <Text style={styles.iconPlaceholderText}>Photo</Text>
        </View>
      </View>
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
    width: 65,
    height: 65,
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
    height: 80,
    backgroundColor: "crimson",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TaskItem;
