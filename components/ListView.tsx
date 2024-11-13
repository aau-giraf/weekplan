import React, { Fragment } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import SwipeableList, { Action } from "./SwipeableList/SwipeableList";
import { colors } from "../utils/SharedStyles";
import { ProfilePicture } from "./ProfilePage";

type ListItem = {
  id: number | string;
  firstName: string;
  lastName: string;
};

type ListViewProps<T extends ListItem> = {
  data: T[];
  loadingMessage: string;
  errorMessage: string;
  isLoading: boolean;
  error: boolean;
  handleDelete: (id: T["id"]) => void;
  handleUpdate?: (id: T["id"]) => void;
  getLabel: (item: T) => string;
  keyExtractor: (item: T) => string;
};

const ListView = <T extends ListItem>({
  data,
  loadingMessage,
  errorMessage,
  isLoading,
  error,
  handleDelete,
  handleUpdate,
  getLabel,
  keyExtractor,
}: ListViewProps<T>) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>{errorMessage}</Text>;
  }

  const rightActions: Action<T>[] = [
    {
      icon: "person-remove-outline",
      color: colors.crimson,
      onPress: (item) => handleDelete(item.id),
    },
  ];

  const leftActions: Action<T>[] = [
    {
      icon: "pencil",
      color: colors.blue,
      onPress: (item) => handleUpdate?.(item.id),
    },
  ];

  const renderItem = (item: T) => (
    <View style={styles.itemContainer} key={keyExtractor(item)}>
      <ProfilePicture label={getLabel(item)} style={styles.profilePicture} />
      <Text numberOfLines={3} style={{ flexShrink: 1 }}>
        {getLabel(item)}
      </Text>
    </View>
  );

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <View style={styles.container}>
        <SwipeableList
          items={data}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={keyExtractor}
          flatListProps={{
            ItemSeparatorComponent: () => <View style={{ height: 10 }} />,
          }}
          rightActions={rightActions}
          leftActions={leftActions}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  profilePicture: {
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default ListView;
