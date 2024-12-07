import { FlatList } from "react-native-gesture-handler";
import SearchBar from "../../../../../components/SearchBar";
import { Image, Text, StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { Fragment, useState } from "react";
import { BASE_URL } from "../../../../../utils/globals";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../../../utils/SharedStyles";
import { useLocalSearchParams } from "expo-router";
import usePictogram, { Pictogram } from "../../../../../hooks/usePictogram";
import { useToast } from "../../../../../providers/ToastProvider";
import SafeArea from "../../../../../components/SafeArea";
import useSearch from "../../../../../hooks/useSearch";

const ViewPictograms = () => {
  const { viewpictograms } = useLocalSearchParams();
  const parsedId = Number(viewpictograms);
  const { fetchAllPictrograms, deletePictogram } = usePictogram(parsedId);
  const { addToast } = useToast();
  const { data, fetchNextPage } = fetchAllPictrograms;
  const pictograms = data?.pages?.flat();

  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (item: Pictogram) => {
    Alert.alert("Slet piktogram", `Er du sikker på at du vil slette ${item.pictogramName}?`, [
      {
        text: "Annuller",
        style: "cancel",
      },
      {
        text: "Slet",
        style: "destructive",
        onPress: () => {
          deletePictogram
            .mutateAsync(item.id)
            .then(() => {
              addToast({ message: "Piktogrammet blev slettet", type: "success" }, 2000);
            })
            .catch(() => {
              addToast({ message: "Der skete en fejl", type: "error" });
            });
        },
      },
    ]);
  };

  const filteredPictures = useSearch(pictograms || [], searchQuery, (pictogram) => pictogram.pictogramName);

  const renderItem = ({ item }: { item: Pictogram }) => {
    const uri = `${BASE_URL}/${item.pictogramUrl}`;
    return (
      <TouchableOpacity style={styles.pictogramContainer} onLongPress={() => handleDelete(item)}>
        <Image source={{ uri }} resizeMode="contain" style={styles.pictogramImage} />
        <Text style={styles.pictogramText}>{item.pictogramName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Fragment>
      <View style={{ backgroundColor: colors.white }}>
        <SafeArea />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={{ marginTop: 50 }} />
        <FlatList
          bounces={false}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          numColumns={2}
          data={filteredPictures}
          renderItem={renderItem}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.2}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    padding: ScaleSize(10),
    backgroundColor: colors.white,
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
