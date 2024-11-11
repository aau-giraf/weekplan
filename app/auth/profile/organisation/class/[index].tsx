import { useLocalSearchParams } from "expo-router";
import useClasses from "../../../../../hooks/useClasses";
import { Text, View } from "react-native";

const ViewClass = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useClasses(parsedID);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading class data</Text>;
  }

  return (
    <View>
      <Text>{data?.name}</Text>
    </View>
  );
};

export default ViewClass;
