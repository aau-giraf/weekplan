import React, { Fragment, useMemo, useRef } from "react";
import { ScrollView, View, FlatList, Text, ActivityIndicator, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import RenderSetting from "../../../../../components/RenderSetting";
import { colors, ScaleSize, SettingsSharedStyles, SharedStyles } from "../../../../../utils/SharedStyles";
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
    router.dismissTo(`/auth/profile/organisation/${data?.id}`);
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
        <BottomSheetScrollView contentContainerStyle={SettingsSharedStyles.sheetContent} bounces={false}>
          <Text style={SharedStyles.header}>{`Vil du slette klassen \n "${gradeName}"`}</Text>
          <Text style={{ fontSize: 18, marginBottom: ScaleSize(20) }}>
            Indtast klassens navn for at bekræfte
          </Text>
          <TextInput
            style={SettingsSharedStyles.input}
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
        <ScrollView style={SettingsSharedStyles.scrollContainer} bounces={false}>
          <View style={SettingsSharedStyles.profileSection}>
            <View style={SettingsSharedStyles.profileContainer}>
              <InitialsPicture
                style={SettingsSharedStyles.mainProfilePicture}
                label={currentGrade?.name || "Ukendt klasse"}
                fontSize={100}
              />
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 30, fontWeight: "500" }}>{currentGrade?.name}</Text>
              </View>
            </View>
          </View>
          <View style={SettingsSharedStyles.settingsContainer}>
            <FlatList
              bounces={false}
              data={settings}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    SettingsSharedStyles.listItem,
                    index > 0 && SettingsSharedStyles.itemWithTopSeparator,
                  ]}>
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

export default Settings;
