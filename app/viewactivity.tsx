import React from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { StyleSheet } from "react-native-size-scaling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSingleActivity } from "../hooks/useActivity";
import { colors, SharedStyles } from "../utils/SharedStyles";

const ViewActivity = () => {
  const id = parseInt(
    useLocalSearchParams<{ activityId: string }>().activityId
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
    <View style={SharedStyles.container}>
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
  activityContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  activityName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.black,
  },
  activityDescription: {
    fontSize: 18,
    marginBottom: 8,
    color: colors.black,
  },
  activityTime: {
    fontSize: 18,
    color: colors.black,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
    color: colors.red,
  },
});

export default ViewActivity;
