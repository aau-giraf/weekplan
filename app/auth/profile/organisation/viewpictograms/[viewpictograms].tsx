import { FlatList } from "react-native-gesture-handler";

import { View, Image, Text, StyleSheet } from "react-native";
import { Fragment } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../../../../../utils/globals";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../../../utils/SharedStyles";
import { useLocalSearchParams } from "expo-router";
import usePictogram, { Pictogram } from "../../../../../hooks/usePictogram";

const ViewPictograms = () => {
  const { viewpictograms } = useLocalSearchParams();
  const parsedId = Number(viewpictograms);
  const { fetchAllPictrograms } = usePictogram(parsedId);
  const { data, fetchNextPage } = fetchAllPictrograms;
  const pictograms = data?.pages?.flat();

  const renderItem = ({ item }: { item: Pictogram }) => {
    const uri = `${BASE_URL}/${item.pictogramUrl}`;
    return (
      <View style={styles.pictogramContainer}>
        <Image source={{ uri }} resizeMode="contain" style={styles.pictogramImage} />
        <Text style={styles.pictogramText}>{item.pictogramName}</Text>
      </View>
    );
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea} />
      <FlatList
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumnWrapper}
        numColumns={2}
        data={pictograms}
        renderItem={renderItem}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.2}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  flatListContent: {
    padding: ScaleSize(10),
    backgroundColor: colors.white,
  },
  flatListColumnWrapper: {
    justifyContent: "space-around",
  },
  pictogramContainer: {
    width: "50%",
    alignItems: "center",
  },
  pictogramImage: {
    width: ScaleSizeW(250),
    height: ScaleSizeH(250),
  },
  pictogramText: {
    textTransform: "capitalize",
    textAlign: "center",
    fontWeight: "600", // Use a string for fontWeight
    fontSize: ScaleSize(25),
  },
});

export default ViewPictograms;
