import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, ScaleSize, ScaleSizeW, SharedStyles } from "../../../utils/SharedStyles";
import { ActivityDTO } from "../../../hooks/useActivity";

type ActivitySelectListProps = {
  activities: ActivityDTO[];
  toggleCheck: (activityId: number) => void;
  selectedIds: number[];
};

/**
 * Component that renders a list of activities with selectable items.
 *
 * @param {Object} props - The component props.
 * @param {ActivityDTO[]} props.activities - The list of activities to display.
 * @param {Function} props.toggleCheck - Function to toggle the selection state of an activity.
 * @param {number[]} props.selectedIds - Array of selected activity IDs.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ActivitySelectList = ({ activities, toggleCheck, selectedIds }: ActivitySelectListProps) => {
  const renderItem = ({ item }: { item: ActivityDTO }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleCheck(item.activityId)}
        style={[styles.activityEntry, { borderLeftWidth: selectedIds.includes(item.activityId) ? 5 : 0 }]}>
        <Text style={{ fontSize: 23, marginRight: 10 }}>
          {item.startTime}-{item.endTime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        bounces={false}
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.activityId.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

export default ActivitySelectList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ScaleSize(10),
  },
  activityEntry: {
    ...SharedStyles.flexRow,
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderColor: colors.blue,
    padding: ScaleSize(5),
    paddingLeft: ScaleSizeW(10),
  },
});
