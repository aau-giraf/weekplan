import { FlatList } from "react-native-gesture-handler";
import { ActivityDTO } from "../../../DTO/activityDTO";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, ScaleSize, ScaleSizeW, SharedStyles } from "../../../utils/SharedStyles";

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
        style={[styles.activityEntry, { borderLeftWidth: selectedIds.includes(item.activityId) ? 1 : 0 }]}>
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.activityId.toString()}
      />
    </View>
  );
};

export default ActivitySelectList;

const styles = StyleSheet.create({
  container: {
    maxHeight: "50%",
  },
  activityEntry: {
    ...SharedStyles.flexRow,
    marginBottom: 2,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: colors.blue,
    padding: ScaleSize(5),
    paddingLeft: ScaleSizeW(10),
  },
});
