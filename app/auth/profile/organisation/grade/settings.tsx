import React, { Fragment, useMemo, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import RenderSetting from "../../../../../components/RenderSetting";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import { Setting } from "../../../../../utils/settingsUtils";
import useGrades from "../../../../../hooks/useGrades";
import { InitialsPicture } from "../../../../../components/profilepicture_components/InitialsPicture";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import useOrganisation from "../../../../../hooks/useOrganisation";
import { useToast } from "../../../../../providers/ToastProvider";
import SafeArea from "../../../../../components/SafeArea";

type Params = {
  gradeId: string;
};

const Settings = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const parsedID = Number(gradeId);
  const { data, error, isLoading } = useGrades(parsedID);
  const { deleteGrade, isLoading: orgIsLoading, error: orgError } = useOrganisation(data?.id!);
  const currentGrade = data?.grades.find((grade) => grade.id === parsedID);
  const deleteSheetRef = useRef<BottomSheet>(null);
  const { addToast } = useToast();

  const deleteCloseBS = () => deleteSheetRef.current?.close();

  const deleteOpenBS = () => deleteSheetRef.current?.expand();

  const settings: Setting[] = useMemo(
    () => [
      {
        icon: "person-add-outline",
        label: "Tilføj borger",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/grade/addcitizen",
            params: { gradeId: gradeId },
          });
        },
      },
      {
        icon: "person-remove-outline",
        label: "Fjern borger",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/grade/removecitizen",
            params: { gradeId: gradeId },
          });
        },
      },
      {
        icon: "create-outline",
        label: "Rediger klasse",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/grade/editgrade",
            params: { gradeId: gradeId },
          });
        },
      },
      {
        icon: "trash-outline",
        label: "Slet klasse",
        onPress: () => {
          deleteOpenBS();
        },
      },
    ],
    [gradeId]
  );

  if (isLoading || orgIsLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error || orgError) {
    return <Text>{error ? error.message : orgError?.message}</Text>;
  }

  const handleDeleteGrade = async () => {
    await deleteGrade
      .mutateAsync(Number(gradeId))
      .then(() => {
        addToast({ message: "Klassen er blevet slettet", type: "success" });
      })
      .catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
    deleteCloseBS();
    router.push(`/auth/profile/organisation/${data?.id}`);
  };

  type deleteBottomSheetProps = {
    bottomSheetRef: React.RefObject<BottomSheet>;
    handleDeleteGrade: Function;
    gradeName: string;
  };

  const DeleteBottomSheet = ({ bottomSheetRef, gradeName, handleDeleteGrade }: deleteBottomSheetProps) => {
    const [userInput, setUserInput] = React.useState("");
    return (
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        keyboardBlurBehavior="restore"
        index={-1}
        style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} bounces={false}>
          <Text style={SharedStyles.header}>{`Vil du slette klassen \n "${gradeName}"`}</Text>
          <Text style={{ fontSize: 18, marginBottom: ScaleSize(20) }}>
            Indtast klassens navn for at bekræfte
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => setUserInput(text)}
            value={userInput}
            testID={"delete-org-input"}
          />
          <SecondaryButton
            label="Bekræft"
            style={{ backgroundColor: colors.red, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
            disabled={userInput !== currentGrade?.name}
            onPress={() => handleDeleteGrade()}
            testID={"confirm-delete-button"}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  };

  return (
    <Fragment>
      <View style={{ flexGrow: 1, position: "relative" }}>
        <SafeArea style={{ backgroundColor: colors.lightBlueMagenta }} />
        <ScrollView style={styles.scrollContainer} bounces={false}>
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              <InitialsPicture
                style={styles.mainProfilePicture}
                label={currentGrade?.name || "Ukendt klasse"}
                fontSize={100}
              />
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 30, fontWeight: "500" }}>{currentGrade?.name}</Text>
              </View>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <FlatList
              bounces={false}
              data={settings}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={[styles.listItem, index > 0 && styles.itemWithTopSeparator]}>
                  <RenderSetting item={item} />
                </View>
              )}
              keyExtractor={(item) => item.label}
            />
          </View>
        </ScrollView>
      </View>
      <DeleteBottomSheet
        bottomSheetRef={deleteSheetRef}
        handleDeleteGrade={handleDeleteGrade}
        gradeName={currentGrade?.name!}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: colors.lightBlueMagenta,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    paddingTop: 20,
    gap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  settingsContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: colors.white,
  },
  itemWithTopSeparator: {
    borderTopWidth: 0.32,
    borderTopColor: colors.black,
  },
  mainProfilePicture: {
    width: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    height: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
  input: {
    width: ScaleSize(500),
    height: ScaleSize(50),
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    padding: ScaleSize(10),
    marginBottom: ScaleSize(20),
  },
});

export default Settings;
