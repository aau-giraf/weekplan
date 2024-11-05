import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { colors, SharedStyles } from "../utils/SharedStyles";
import useInvitation from "../hooks/useInvitation";

type Invitation = {
  id: number;
  organizationId: number;
  receiverId: string;
  senderId: string;
};


const ViewInvitation = () => {
  const fetchByUser = useInvitation();
  const { data, error, isLoading } = fetchByUser;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Fejl med at hente invitationer: {error.message}</Text>;
  }

  const renderInvitationContainer: ListRenderItem<Invitation> = ({ item }) => {
    return (
      <View key={item.id} style={styles.invitationContainer}>
        <Text>Organization ID: {item.organizationId}</Text>
        <Text>Sender ID: {item.senderId}</Text>
        <Text>Receiver ID: {item.receiverId}</Text>
      </View>
    );
  };

  console.log(data);

  return (
    <View style={styles.container}>
      <Text style={SharedStyles.header}>Invitations</Text>
      <FlatList
        data={data}
        renderItem={renderInvitationContainer}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.white,
  },
  invitationContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 20,
    borderWidth: 1,
    margin: 10,
    borderColor: colors.black,
    backgroundColor: colors.lightBlue,
  },
  invitationText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  invitationItem: {
    paddingVertical: 5,
  },
});

export default ViewInvitation;
