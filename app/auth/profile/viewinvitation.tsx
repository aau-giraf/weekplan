import React, { Fragment } from "react";
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeW, SharedStyles } from "../../../utils/SharedStyles";
import useInvitation from "../../../hooks/useInvitation";
import { Ionicons } from "@expo/vector-icons";
import SafeArea from "../../../components/SafeArea";

type Invitation = {
  id: number;
  organizationName: string;
  senderName: string;
};

const ViewInvitation = () => {
  const { fetchByUser, acceptInvitation } = useInvitation();
  const { data, error, isLoading } = fetchByUser;

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={SharedStyles.bigErrorText}>Fejl med at hente invitationer: {error.message}</Text>
      </View>
    );
  }

  const handleInvitation = async (id: number, isAccepted: boolean) => {
    await acceptInvitation.mutateAsync({
      invitationId: id,
      isAccepted,
    });
  };

  const renderInvitationContainer: ListRenderItem<Invitation> = ({ item }) => {
    return (
      <View key={item.id} style={styles.invitationContainer}>
        <View style={styles.textContainer}>
          <Text>Organisation: {item.organizationName}</Text>
          <Text>Sendt af: {item.senderName}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: ScaleSizeW(30) }}>
          <Ionicons
            name={"checkmark"}
            size={ScaleSize(48)}
            color={colors.green}
            onPress={() => handleInvitation(item.id, true)}
          />
          <Ionicons
            name={"close"}
            size={ScaleSize(48)}
            color={colors.red}
            onPress={() => handleInvitation(item.id, false)}
          />
        </View>
      </View>
    );
  };

  return (
    <Fragment>
      <SafeArea style={{ backgroundColor: colors.white }} />
      <View style={styles.container}>
        <Text style={SharedStyles.title}>Invitations</Text>
        <FlatList
          bounces={false}
          data={data}
          renderItem={renderInvitationContainer}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  invitationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    margin: 10,
    backgroundColor: colors.lightBlue,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default ViewInvitation;
