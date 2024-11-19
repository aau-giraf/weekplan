import React, { Fragment } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import SwipeableList, { Action } from "./swipeablelist/SwipeableList";
import { colors, ScaleSizeH } from "../utils/SharedStyles";
import { ProfilePicture } from "./ProfilePicture";

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
  onPress?: (item: T) => void;
};

const ListView = <T extends ListItem>({
  data,
  errorMessage,
  isLoading,
  error,
  handleDelete,
  handleUpdate,
  getLabel,
  keyExtractor,
  onPress,
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
    <Pressable style={styles.itemContainer} key={keyExtractor(item)} onPress={() => onPress && onPress(item)}>
      {typeof item.id === "string" ? (
        <ProfilePicture label={getLabel(item)} style={styles.profilePicture} userId={item.id} />
      ) : (
        <ProfilePicture label={getLabel(item)} style={styles.profilePicture} />
      )}
      <Text numberOfLines={3} style={styles.label}>
        {getLabel(item)}
      </Text>
    </Pressable>
  );

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />

      <SwipeableList
        items={data}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={keyExtractor}
        flatListProps={{
          contentContainerStyle: { flexGrow: 1 },
        }}
        rightActions={rightActions}
        leftActions={leftActions}
      />
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
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePicture: {
    width: "25%",
    maxHeight: ScaleSizeH(300),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  label: {
    flex: 1,
    marginLeft: 10,
    color: colors.black,
    flexWrap: "wrap",
  },
});

export default ListView;
