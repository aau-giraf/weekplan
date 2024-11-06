import React from "react";
import { View, Text, StyleSheet, FlatList, ListRenderItem, ActivityIndicator, Button, Alert} from "react-native";
import { colors, SharedStyles } from "../utils/SharedStyles";
import useInvitation from "../hooks/useInvitation";

type Invitation = {
  id: number;
  organizationId: number;
  receiverId: string;
  senderId: string;
};


const ViewInvitation = () => {
  const {fetchByUser, isError,isLoading, data, useRespondToInvitation, useDeleteInvitation} = useInvitation();

  const handleResponse = (id: number, accepted: boolean) => {
    const action = accepted ? 'acceptere' : 'afvise';
    Alert.alert(
      `Er du sikker på, at du vil ${action} denne invitation?`,
      '',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
              useRespondToInvitation.mutate({ id, response: accepted }, {onSuccess: () => useDeleteInvitation.mutate(id)});
          },
        },
      ]
    );
  };
  

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return <Text>Fejl ved hentning af invitationer</Text>;
  }

  const renderInvitationContainer: ListRenderItem<Invitation> = ({ item }) => {
    return (
      <View key={item.id} style={styles.invitationContainer}>
        <Text>Organisation ID: {item.organizationId}</Text>
        <Text>Afsender ID: {item.senderId}</Text>
        <Text>Modtager ID: {item.receiverId}</Text>
        <Button
          title="Accepter"
          onPress={() => handleResponse(item.id, true)}
          color="#28a745"
        />
        <Button
          title="Afvis"
          onPress={() => handleResponse(item.id, false)}
          color="#dc3545"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={SharedStyles.header}>Invitationer</Text>
      <FlatList
        data={data}
        renderItem={renderInvitationContainer}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

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