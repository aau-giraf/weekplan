import { View, StyleSheet} from "react-native";
import ActivityAddButton from "../components/weekoverview_components/activity_components/ActivityAddButton";
import ActivityItemHeader from "../components/weekoverview_components/activity_components/ActivityItemHeader";
import WeekSelection from "../components/weekoverview_components/WeekSelection";
import DaysContainer from "../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../components/weekoverview_components/activity_components/ActivityItemList";
import { colors } from "../utils/SharedStyles";

const WeekPlanScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WeekSelection />
        <DaysContainer />
      </View>
      <ActivityItemHeader />
      <ActivityItemList />
      <ActivityAddButton />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container:{
    height: "100%",
  },
  header: {
    backgroundColor: colors.white,
  },
});

export default WeekPlanScreen;