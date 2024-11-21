import { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { fetchPictogramRequest } from "../apis/pictogramAPI";
import { PictogramDTO } from "../hooks/usePictogram";
import { BASE_URL } from "../utils/globals";

const ImagePickerSelector = ({
  onSelect,
  onClose,
}: {
  onSelect: (pictogram: PictogramDTO) => void;
  onClose: () => void;
}) => {
  const [showScreen, setScreenVisibility] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pictograms, setPictograms] = useState<PictogramDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPictogramId, setSelectedPictogramId] = useState<number | null>(null);

  const fetchAllPictograms = async () => {
    setIsLoading(true);
    const fetchedPictograms: PictogramDTO[] = [];
    let id = 1;
    while (true) {
      try {
        const pictogram = await fetchPictogramRequest(id);

        pictogram.pictogramUrl = `${BASE_URL}/${pictogram.pictogramUrl}`;

        fetchedPictograms.push(pictogram);
        id++;
      } catch (error) {
        break;
      }
    }
    setPictograms(fetchedPictograms);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllPictograms();
  }, []);

  const open = () => {
    setScreenVisibility(true);
  };

  const close = () => {
    setScreenVisibility(false);
    onClose();
  };

  const filteredPictograms = searchText
    ? pictograms.filter((p) => p.pictogramName.toLowerCase().includes(searchText.toLowerCase()))
    : pictograms;

  return (
    <View>
      <Button title="Vælg Billede" onPress={open} />
      <Modal visible={showScreen} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={styles.imageContainer}>
              {isLoading && <Text>Loading...</Text>}
              {filteredPictograms.length > 0
                ? filteredPictograms.map((pictogram) => (
                    <TouchableOpacity key={pictogram.id} onPress={() => setSelectedPictogramId(pictogram.id)}>
                      <Image
                        source={{ uri: pictogram.pictogramUrl }}
                        style={[styles.image, selectedPictogramId === pictogram.id && styles.selectedImage]}
                      />
                    </TouchableOpacity>
                  ))
                : !isLoading && <Text>No images found</Text>}
            </ScrollView>
            <TextInput
              style={styles.searchBox}
              placeholder="Søg efter billede"
              placeholderTextColor="#808080"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={close} style={styles.button}>
                <Text>Luk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const selectedPictogram = pictograms.find((p) => p.id === selectedPictogramId);
                  if (selectedPictogram) {
                    onSelect(selectedPictogram);
                    close();
                  } else {
                    // Optionally, show a message if no pictogram is selected
                  }
                }}>
                <Text>Vælg Billede</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalBox: {
    backgroundColor: "#808080",
    alignItems: "center",
    width: "85%",
    height: "85%",
    borderRadius: 10,
    padding: 20,
  },
  searchBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#808080",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  imageContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    backgroundColor: "#808080",
    borderColor: "#000000",
    borderWidth: 2,
    width: 125,
    height: 125,
    margin: 10,
  },
  selectedImage: {
    borderColor: "#FFFF00",
    borderWidth: 2,
  },
  buttonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#008000",
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 10,
  },
});

export default ImagePickerSelector;
