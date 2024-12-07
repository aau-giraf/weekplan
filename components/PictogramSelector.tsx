import { Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../utils/globals";
import usePictogram, { Pictogram } from "../hooks/usePictogram";
import { colors, ScaleSize, ScaleSizeW, ScaleSizeH } from "../utils/SharedStyles";
import { FlatList } from "react-native-gesture-handler";
import SearchBar from "./SearchBar";
import { useState } from "react";
import useSearch from "../hooks/useSearch";

type PictogramSelectorProps = {
  organisationId: number;
  selectedPictogram: number | undefined;
  setSelectedPictogram: (pictogram: Pictogram) => void;
};

const PictogramSelector = ({
  organisationId,
  selectedPictogram,
  setSelectedPictogram,
}: PictogramSelectorProps) => {
  const { fetchAllPictrograms } = usePictogram(organisationId);
  const { data, fetchNextPage } = fetchAllPictrograms;
  const pictograms = data?.pages?.flat();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPictures = useSearch(pictograms || [], searchQuery, (pictogram) => pictogram.pictogramName);

  const renderItem = ({ item }: { item: Pictogram }) => {
    const uri = `${BASE_URL}/${item.pictogramUrl}`;
    return (
      <TouchableOpacity
        style={[
          styles.pictogramContainer,
          selectedPictogram === item.id && { backgroundColor: colors.lightBlue },
        ]}
        onPress={() => {
          setSelectedPictogram(item);
        }}>
        <Image source={{ uri: uri }} resizeMode="contain" style={styles.pictogramImage} />
        <Text style={styles.pictogramText}>{item.pictogramName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={styles.searchBar} />
      <FlatList
        bounces={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={2}
        data={filteredPictures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.1}
        maxToRenderPerBatch={8}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 25,
    width: "90%",
    alignSelf: "center",
    height: 50,
  },
  flatListContent: {
    padding: ScaleSize(10),
    backgroundColor: colors.white,
  },
  pictogramContainer: {
    width: "50%",
    alignItems: "center",
    paddingVertical: ScaleSize(10),
  },
  pictogramImage: {
    width: ScaleSizeW(250),
    height: ScaleSizeH(250),
  },
  pictogramText: {
    textTransform: "capitalize",
    textAlign: "center",
    fontWeight: "600",
    fontSize: ScaleSize(25),
  },
});

export default PictogramSelector;
