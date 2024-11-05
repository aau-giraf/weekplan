import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useProfile from "../hooks/useProfile";
import { ProfilePicture } from "../components/ProfilePage";
import { useRef, useState } from "react";
import IconButton from "../components/IconButton";
import useOrganisation, { OrgDTO } from "../hooks/useOrganisation";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { UseMutationResult } from "@tanstack/react-query";
import { useToast } from "../providers/ToastProvider";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../utils/SharedStyles";

import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const calculateNumberOfColumns = () => {
  const columnWidth = 150;
  const numColumns = Math.floor(screenWidth / columnWidth);
  return numColumns > 0 ? numColumns : 1;
};

const ProfilePage: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { data, isLoading, isError } = useProfile();
  const {
    data: orgData,
    isLoading: orgIsLoading,
    createOrganisation,
    refetch,
  } = useOrganisation();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View>
        <Text>Profil data kunne ikke hentes</Text>
      </View>
    );
  }

  const renderOrgContainer = ({
    item,
  }: {
    item: { name: string; id: number };
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // @ts-ignore
        router.replace(`/vieworganisation/${item.id}`);
      }}>
      <ProfilePicture label={item.name} style={styles.profilePicture} />
      <Text
        adjustsFontSizeToFit={true}
        style={styles.itemText}
        maxFontSizeMultiplier={2}
        minimumFontScale={0.3}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        refreshing={orgIsLoading}
        itemLayoutAnimation={LinearTransition}
        onRefresh={async () => await refetch()}
        data={orgData}
        renderItem={renderOrgContainer}
        keyExtractor={(item, index) => index.toString() + item.name}
        numColumns={calculateNumberOfColumns()}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text>Ingen organisationer fundet</Text>}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.profileHeader}>
              <ProfilePicture
                style={styles.mainProfilePicture}
                label={`${data.firstName} ${data.lastName}`}
              />
              <View style={styles.profileTextContainer}>
                <Text style={SharedStyles.header}>{data.email}</Text>
                <Text style={SharedStyles.header}>
                  {`${data.firstName} ${data.lastName}`}
                </Text>
              </View>
              <IconButton style={styles.iconMail}>
                <Ionicons name="mail-outline" size={ScaleSize(40)} />
              </IconButton>
            </View>
            <View style={styles.organizationsContainer}>
              <Text style={styles.organizationsText}>Dine orginisationer</Text>
            </View>
          </View>
        }
      />

      <IconButton
        style={styles.iconAdd}
        onPress={() => bottomSheetRef.current?.expand()}>
        <Ionicons name="add" size={ScaleSize(40)} />
      </IconButton>
      {/* TODO REMOVE THIS WHEN ORGS ARE IMPLEMENTED */}
      <IconButton
        style={styles.weekoverview}
        onPress={() => router.push("/weekplanscreen")}>
        <Ionicons name="calendar-outline" size={ScaleSize(40)} />
      </IconButton>
      <AddBottomSheet
        bottomSheetRef={bottomSheetRef}
        createOrganisation={createOrganisation}
      />
    </View>
  );
};

type BottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  createOrganisation: UseMutationResult<OrgDTO, Error, string, OrgDTO[]>;
};
const AddBottomSheet = ({
  bottomSheetRef,
  createOrganisation,
}: BottomSheetProps) => {
  const [name, setName] = useState("");
  const { addToast } = useToast();

  const handleSubmit = () => {
    createOrganisation
      .mutateAsync(name)
      .then(() => {
        setName("");
        bottomSheetRef.current?.close();
      })
      .catch((e) => {
        addToast({ message: e.message, type: "error" });
      });
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}
      onClose={() => setName("")}>
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={SharedStyles.header}>Organisation navn</Text>
        <BottomSheetTextInput
          style={styles.inputValid}
          placeholder="Navn på orginasition"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.buttonValid} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Opret organisation</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  itemContainer: {
    flex: 1,
    margin: ScaleSize(8),
    alignItems: "center",
    width: screenWidth / calculateNumberOfColumns() - ScaleSizeW(8),
  },
  profilePicture: {
    height: ScaleSizeH(200),
    borderRadius: 1000,
    aspectRatio: 1,
  },
  itemText: {
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "flex-start",
  },
  headerContainer: {
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: "white",
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: ScaleSize(10),
    paddingTop: ScaleSize(30),
    alignItems: "center",
    shadowRadius: 20,
    shadowOpacity: 0.15,
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: ScaleSizeH(300),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  profileTextContainer: {
    display: "flex",
    padding: ScaleSize(20),
    justifyContent: "center",
    alignItems: "center",
  },
  organizationsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: ScaleSize(14),
  },
  organizationsText: {
    fontSize: ScaleSize(24),
    marginRight: 10,
  },
  iconMail: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  iconAdd: {
    bottom: ScaleSize(30),
    right: ScaleSize(30),
  },
  weekoverview: {
    bottom: ScaleSize(30),
    left: ScaleSize(30),
  },
  inputValid: {
    width: "85%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonValid: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sheetContent: {
    gap: 10,
    padding: 30,
    alignItems: "center",
  },
});

export default ProfilePage;
