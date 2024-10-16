import { FlatList } from "react-native-gesture-handler";
import { ActivityDTO } from "../../../DTO/activityDTO";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

type ActivitySelectListProps = {
  activities: ActivityDTO[];
  toggleCheck: (activityId: number) => void;
  selectedIds: number[];
};

const ActivitySelectList = ({
  activities,
  toggleCheck,
  selectedIds,
}: ActivitySelectListProps) => {
  const renderItem = ({ item }: { item: ActivityDTO }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleCheck(item.activityId)}
        style={[
          styles.activityEntry,
          { borderLeftWidth: selectedIds.includes(item.activityId) ? 1 : 0 },
        ]}
      >
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
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: "blue",
    padding: 5,
    paddingLeft: 10,
  },
});
