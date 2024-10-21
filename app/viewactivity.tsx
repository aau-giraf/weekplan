import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSingleActivity } from "../hooks/useActivity";
import {colors} from "../utils/colors";

const ViewActivity = () => {
  const id = parseInt(
    useLocalSearchParams<{ activityId: string }>().activityId,
  );
  const { useFetchActivity } = useSingleActivity({ activityId: id });
  const { data, error, isLoading } = useFetchActivity;
  const router = useRouter();

  const handlePress = () => {
    router.back();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return (
      <Text style={styles.errorText}>
        Fejl med at hente aktiviteter: {error.message}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {data && (
        <View style={styles.activityContainer}>
          <Text style={styles.activityName}>{data.name}</Text>
          <Text style={styles.activityDescription}>{data.description}</Text>
          <Text style={styles.activityTime}>
            {data.startTime} - {data.endTime}
          </Text>
        </View>
      )}
      <Button title="Gå tilbage" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  activityContainer: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  activityName: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  activityDescription: {
    color: colors.black,
    fontSize: 16,
    marginBottom: 8,
  },
  activityTime: {
    color: colors.black,
    fontSize: 14,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default ViewActivity;
