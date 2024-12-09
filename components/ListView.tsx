import React, { Fragment } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import SwipeableList, { Action } from "./swipeablelist/SwipeableList";
import { colors, ScaleSizeW, SharedStyles } from "../utils/SharedStyles";
import { ProfilePicture } from "./profilepicture_components/ProfilePicture";
import { InitialsPicture } from "./profilepicture_components/InitialsPicture";

type ListItem = {
  id: number | string;
  firstName: string;
  lastName: string;
};

type ListViewProps<T extends ListItem> = {
  data: T[];
  loadingMessage: string;
  isLoading: boolean;
  error: boolean;
  rightActions?: Action<T>[];
  leftActions?: Action<T>[];
  getLabel: (item: T) => string;
  keyExtractor: (item: T) => string;
  onPress?: (item: T) => void;
};

const ListView = <T extends ListItem>({
  data,
  isLoading,
  error,
  rightActions,
  leftActions,
  getLabel,
  keyExtractor,
  onPress,
}: ListViewProps<T>) => {
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
        <Text style={SharedStyles.bigErrorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = (item: T) => (
    <Pressable style={styles.itemContainer} key={keyExtractor(item)} onPress={() => onPress && onPress(item)}>
      {typeof item.id === "string" ? (
        <ProfilePicture label={getLabel(item)} style={styles.profilePicture} userId={item.id} />
      ) : (
        <InitialsPicture label={getLabel(item)} style={styles.profilePicture} />
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
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePicture: {
    width: ScaleSizeW(125),
    height: ScaleSizeW(125),
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
