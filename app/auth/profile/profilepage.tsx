import { Fragment, useRef } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfilePicture } from "../../../components/profilepicture_components/ProfilePicture";
import IconButton from "../../../components/IconButton";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import useProfile from "../../../hooks/useProfile";
import useOrganisationOverview, { OrgOverviewDTO } from "../../../hooks/useOrganisationOverview";
import { UseMutationResult } from "@tanstack/react-query";
import { useToast } from "../../../providers/ToastProvider";
import Animated, { LinearTransition } from "react-native-reanimated";
import {
  ButtonSharedStyles,
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../../../utils/SharedStyles";
import { router } from "expo-router";
import useInvitation from "../../../hooks/useInvitation";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { InitialsPicture } from "../../../components/profilepicture_components/InitialsPicture";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SubmitButton from "../../../components/forms/SubmitButton";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Navn er for kort" }),
});

export type FormData = z.infer<typeof schema>;

const ProfilePage: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { userId, logout } = useAuthentication();
  const { data, isLoading, isError } = useProfile();
  const { data: orgData, isLoading: orgIsLoading, createOrganisation, refetch } = useOrganisationOverview();
  const { fetchByUser } = useInvitation();
  const { data: inviteData } = fetchByUser;

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <TouchableOpacity
          onPress={async () => {
            await logout();
            router.push("/auth/login");
          }}>
          <Text>Profil data kunne ikke hentes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderOrgContainer = ({ item }: { item: { name: string; id: number } }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        router.push(`/auth/profile/organisation/${item.id}`);
      }}>
      <View style={styles.profileContainer}>
        <InitialsPicture label={item.name} style={styles.mainProfilePicture} fontSize={ScaleSize(75)} />
      </View>
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
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white, flexGrow: 1 }}>
        <View style={styles.container}>
          <Animated.FlatList
            refreshing={orgIsLoading}
            onTouchStart={() => bottomSheetRef.current?.close()}
            itemLayoutAnimation={LinearTransition}
            onRefresh={async () => await refetch()}
            data={orgData}
            renderItem={renderOrgContainer}
            keyExtractor={(item, index) => index.toString() + item.name}
            numColumns={1}
            ListEmptyComponent={<Text style={SharedStyles.notFound}>Ingen organisationer fundet</Text>}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.profileHeader}>
                  <ProfilePicture
                    style={styles.mainProfilePicture}
                    label={`${data.firstName} ${data.lastName}`}
                    userId={userId}
                    fontSize={100}
                  />
                  <View style={styles.profileTextContainer}>
                    <Text style={SharedStyles.header}>{`${data.firstName} ${data.lastName}`}</Text>
                  </View>
                  <IconButton
                    style={ButtonSharedStyles.settings}
                    onPress={() => router.push("/auth/profile/settings")}>
                    <Ionicons name="settings-outline" size={ScaleSize(64)} />
                    {inviteData && inviteData.length > 0 && <View style={styles.notificationBadge} />}
                  </IconButton>
                </View>
                <View style={styles.organizationsContainer}>
                  <Text style={styles.organizationsText}>Dine organisationer</Text>
                </View>
              </View>
            }
          />
        </View>
      </SafeAreaView>
      <View style={ButtonSharedStyles.iconViewAddButton}>
        <IconButton onPress={() => bottomSheetRef.current?.expand()}>
          <Ionicons name="add" size={ScaleSize(50)} />
        </IconButton>
      </View>
      <AddBottomSheet bottomSheetRef={bottomSheetRef} createOrganisation={createOrganisation} />
    </Fragment>
  );
};

type BottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  createOrganisation: UseMutationResult<OrgOverviewDTO, Error, string, OrgOverviewDTO[]>;
};
const AddBottomSheet = ({ bottomSheetRef, createOrganisation }: BottomSheetProps) => {
  const {
    formState: { isSubmitting, isValid },
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { addToast } = useToast();

  const handleSubmit = () => {
    createOrganisation
      .mutateAsync(getValues("name"))
      .then(() => {
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
      style={{ shadowRadius: 20, shadowOpacity: 0.3 }}>
      <BottomSheetScrollView contentContainerStyle={SharedStyles.sheetContent} bounces={false}>
        <Text style={SharedStyles.header}>Organisation navn</Text>
        <BottomSheetTextInput
          placeholder="Organisations navn"
          style={SharedStyles.inputValid}
          onChangeText={(value: string) => {
            setValue("name", value, { shouldValidate: true });
          }}
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          label="Tilføj Organisation"
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.lightBlue,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  profilePicture: {
    height: ScaleSizeH(150),
    borderRadius: 1000,
    aspectRatio: 1,
  },
  itemText: {
    flex: 1,
    flexWrap: "wrap",
    textAlign: "left",
    fontSize: ScaleSize(25),
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.lightBlue,
  },
  profileHeader: {
    backgroundColor: colors.white,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: ScaleSize(10),
    paddingTop: ScaleSizeH(30),
    alignItems: "center",
    shadowRadius: 20,
    shadowOpacity: 0.15,
  },
  mainProfilePicture: {
    width: "60%",
    maxHeight: ScaleSizeH(200),
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
    padding: ScaleSize(30),
  },
  organizationsText: {
    fontSize: ScaleSize(48),
    marginRight: ScaleSizeW(10),
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ScaleSizeH(20),
  },
});

export default ProfilePage;
