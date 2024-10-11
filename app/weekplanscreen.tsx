import { View, StyleSheet, SafeAreaView } from 'react-native';
import AddButton from '../components/AddButton';
import ActivityItemHeader from '../components/ActivityItemHeader';
import WeekSelection from '../components/WeekSelection';
import DaysContainer from '../components/DaysContainer';
import ActivityItemList from '../components/ActivityItemList';

const WeekPlanScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <WeekSelection />
        <DaysContainer />
      </View>
      <ActivityItemHeader />
      <ActivityItemList pathname={`./viewitem`}/>
      <AddButton pathname={'./additem'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: '#F2F5FA',
  },
});

export default WeekPlanScreen;
