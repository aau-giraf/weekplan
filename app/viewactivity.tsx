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
import { colors } from "../utils/colors";
import { rem, SharedStyles } from '../utils/SharedStyles';

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
    fontSize: rem(1),
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.black,
  },
  activityDescription: {
    fontSize: rem(1),
    marginBottom: 8,
    color: colors.black,
  },
  activityTime: {
    fontSize: rem(1),
    color: colors.black,
  },
  errorText: {
    fontSize: rem(1),
    textAlign: "center",
    marginVertical: 20,
    color: colors.red,
  },
});

export default ViewActivity;
