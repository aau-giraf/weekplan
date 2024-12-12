import { CutoffList } from "../../../../components/organisationoverview_components/CutoffList";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import {
  ButtonSharedStyles,
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../../../../utils/SharedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useOrganisation from "../../../../hooks/useOrganisation";
import IconButton from "../../../../components/IconButton";
import { Fragment, useRef } from "react";
import { useToast } from "../../../../providers/ToastProvider";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { GradeView } from "../../../../components/organisationoverview_components/GradeView";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SubmitButton from "../../../../components/forms/SubmitButton";
import SafeArea from "../../../../components/SafeArea";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";

const schema = z.object({
  gradeName: z.string().trim().min(2, { message: "Navn er for kort" }),
});

export type FormData = z.infer<typeof schema>;

const ViewOrganisation = () => {
  const { organisation } = useLocalSearchParams();
  const parsedId = Number(organisation);
  const { data, error, isLoading, createGrade, refetch } = useOrganisation(parsedId);
  const { addToast } = useToast();
  const { userId } = useAuthentication();
  const createBottomSheetRef = useRef<BottomSheet>(null);

  const moderators = data?.users.filter((u) => u.role === "OrgAdmin" || u.role === "OrgOwner");

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
    if (!moderators?.some((moderator) => moderator.id === userId)) {
      return addToast({ message: "Du kan ikke oprette en klasse", type: "error" });
    }
    await createGrade.mutateAsync(gradeName).catch((error: Error) => {
      addToast({ message: error.message, type: "error" });
    });
    closeCreateBS();
  };

  return (
    <Fragment>
      <SafeArea>
        <View style={{ flex: 1, backgroundColor: colors.lightBlue }}>
          <FlatList
            ListEmptyComponent={
              <Text style={[SharedStyles.notFound, { paddingTop: 20 }]}>Ingen klasser fundet</Text>
            }
            onRefresh={async () => await refetch()}
            refreshing={isLoading}
            contentContainerStyle={[{ backgroundColor: colors.lightBlue }, { flexGrow: 1 }]}
            data={data?.grades ?? []}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <GradeView grades={[item]} />}
            ListHeaderComponent={
              <Fragment>
                <View
                  style={{
                    alignItems: "center",
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    paddingBottom: ScaleSize(20),
                    backgroundColor: colors.white,
                  }}>
                  <Text style={styles.OrgName}>{data?.name ?? "Organisation"}</Text>
                  <IconButton
                    style={ButtonSharedStyles.settings}
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
                  <Text style={styles.heading}>Borger</Text>
                  <CutoffList
                    entries={data?.citizens ?? []}
                    onPress={() => router.push(`/auth/profile/organisation/citizens/${parsedId}`)}
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={styles.heading}>Klasser</Text>
                </View>
              </Fragment>
            }
          />
        </View>

        <View style={ButtonSharedStyles.iconViewAddButton}>
          <IconButton onPress={openCreateBS} absolute={true} style={ButtonSharedStyles.iconAddButton}>
            <Ionicons name={"add-outline"} size={ScaleSize(50)} />
          </IconButton>
        </View>
      </SafeArea>
      <CreateGradeButtomSheet bottomSheetRef={createBottomSheetRef} handleConfirm={handleCreateGrade} />
    </Fragment>
  );
};

type CreateGradeButtomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  handleConfirm: Function;
};

const CreateGradeButtomSheet = ({ bottomSheetRef, handleConfirm }: CreateGradeButtomSheetProps) => {
  const {
    formState: { isSubmitting, isValid },
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}
      style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
      <BottomSheetScrollView contentContainerStyle={SharedStyles.sheetContent} bounces={false}>
        <Text style={SharedStyles.header}>Tilføj en klasse</Text>
        <BottomSheetTextInput
          placeholder="Klasse navn"
          style={SharedStyles.inputValid}
          onChangeText={(value: string) => {
            setValue("gradeName", value, { shouldValidate: true });
          }}
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={() => {
            handleConfirm(getValues("gradeName"));
          }}
          label="Tilføj klasse"
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
});

export default ViewOrganisation;
