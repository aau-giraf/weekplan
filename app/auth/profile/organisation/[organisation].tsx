import { CutoffList } from "../../../../components/organisationoverview_components/CutoffList";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../utils/SharedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useOrganisation from "../../../../hooks/useOrganisation";
import IconButton from "../../../../components/IconButton";
import React, { Fragment, useRef, useState } from "react";
import { useToast } from "../../../../providers/ToastProvider";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { GradeView } from "../../../../components/organisationoverview_components/GradeView";
import SecondaryButton from "../../../../components/forms/SecondaryButton";

const ViewOrganisation = () => {
  const { organisation } = useLocalSearchParams();
  const parsedId = Number(organisation);

  const { data, error, isLoading, createGrade } = useOrganisation(parsedId);
  const { addToast } = useToast();
  const createBottomSheetRef = useRef<BottomSheet>(null);

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
        <Text style={SharedStyles.bigErrorText}>{error.message}</Text>
      </View>
    );
  }

  const openCreateBS = () => createBottomSheetRef.current?.expand();

  const closeCreateBS = () => createBottomSheetRef.current?.close();

  const handleCreateGrade = async (gradeName: string) => {
    await createGrade.mutateAsync(gradeName).catch((error: Error) => {
      addToast({ message: error.message, type: "error" });
    });
    closeCreateBS();
  };

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.OrgName}>{data?.name ?? "Organisation"}</Text>
            <IconButton
              style={styles.settings}
              onPress={() =>
                router.push({
                  pathname: "/auth/profile/organisation/settings",
                  params: { organisation: parsedId },
                })
              }>
              <Ionicons name="settings-outline" size={ScaleSize(64)} />
            </IconButton>
            <Text style={styles.heading}>Medlemmer</Text>
            <CutoffList
              entries={data?.users ?? []}
              onPress={() => {
                router.push(`/auth/profile/organisation/members/${parsedId}`);
              }}
            />
            <View style={styles.alignHeader}>
              <Text style={styles.heading}>Borger</Text>
              <IconButton
                onPress={() => {
                  router.push({
                    pathname: "/auth/profile/organisation/addcitizen",
                    params: { orgId: parsedId },
                  });
                }}
                absolute={false}
                style={styles.iconButton}>
                <Ionicons name={"add-circle-outline"} size={ScaleSize(25)} />
              </IconButton>
            </View>
            <CutoffList
              entries={data?.citizens ?? []}
              onPress={() => router.push(`/auth/profile/organisation/citizens/${parsedId}`)}
            />
            <FlatList
              ListHeaderComponent={
                <View style={styles.classContainer}>
                  <Text style={styles.classText}>Klasser</Text>
                </View>
              }
              ListEmptyComponent={<Text style={styles.notFound}>Ingen klasser fundet</Text>}
              contentContainerStyle={[styles.gradeView, { flexGrow: 1 }]}
              data={data?.grades ?? []}
              bounces={false}
              numColumns={1}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <GradeView grades={[item]} />}
            />
          </View>
        </View>
        <View style={styles.iconViewAddButton}>
          <IconButton onPress={openCreateBS} absolute={true} style={styles.iconAddButton}>
            <Ionicons name={"add-outline"} size={ScaleSize(50)} />
          </IconButton>
        </View>
      </SafeAreaView>
      <CreateGradeButtomSheet bottomSheetRef={createBottomSheetRef} handleConfirm={handleCreateGrade} />
    </Fragment>
  );
};

type CreateGradeButtomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  handleConfirm: Function;
};

const CreateGradeButtomSheet = ({ bottomSheetRef, handleConfirm }: CreateGradeButtomSheetProps) => {
  const [gradeName, setGradeName] = useState("");

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}
      onClose={() => setGradeName("")}
      style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
      <BottomSheetScrollView contentContainerStyle={SharedStyles.sheetContent} bounces={false}>
        <Text style={SharedStyles.header}>Tilføj en klasse</Text>
        <BottomSheetTextInput
          style={SharedStyles.inputValid}
          placeholder="Navn på klasse"
          value={gradeName}
          onChangeText={(value: string) => setGradeName(value)}
        />
        <SecondaryButton
          label="Bekræft"
          style={{ backgroundColor: colors.blue, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
          onPress={() => handleConfirm(gradeName)}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  OrgName: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginTop: ScaleSizeH(25),
    marginBottom: ScaleSize(10),
  },
  ActionView: {
    ...SharedStyles.flexRow,
    gap: ScaleSizeW(10),
  },
  alignHeader: {
    ...SharedStyles.flexRow,
    gap: ScaleSizeW(10),
    alignItems: "center",
  },
  classContainer: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: ScaleSize(30),
    minWidth: "100%",
  },
  classText: {
    fontSize: ScaleSize(25),
    fontWeight: "bold",
  },
  heading: {
    fontSize: ScaleSize(25),
    marginTop: ScaleSize(10),
    marginBottom: ScaleSize(10),
    textAlign: "center",
    fontWeight: "bold",
  },
  iconAddButton: {
    height: ScaleSize(100),
    width: ScaleSize(100),
    marginBottom: ScaleSize(10),
  },
  gradeView: {
    backgroundColor: colors.lightBlue,
  },
  iconViewAddButton: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: ScaleSize(20),
    right: ScaleSize(20),
  },
  iconButton: {
    height: ScaleSize(30),
    width: ScaleSize(30),
  },
  settings: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  notFound: {
    color: colors.black,
    fontSize: ScaleSize(26),
    textAlign: "center",
    paddingTop: ScaleSize(200),
  },
});

export default ViewOrganisation;
