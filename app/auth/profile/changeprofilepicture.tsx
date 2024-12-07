import { View, StyleSheet } from "react-native";
import { ProfilePicture } from "../../../components/profilepicture_components/ProfilePicture";
import CameraButton from "../../../components/CameraButton";
import SecondaryButton from "../../../components/forms/SecondaryButton";
import { colors, ScaleSizeH } from "../../../utils/SharedStyles";
import { router } from "expo-router";
import React, { useState } from "react";
import { uploadProfileImageRequest } from "../../../apis/profileAPI";
import { useToast } from "../../../providers/ToastProvider";
import FormContainer from "../../../components/forms/FormContainer";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { useProfilePictureUpdater } from "../../../providers/ProfilePictureUpdaterProvider";
import { UploadProfilePicture } from "../../../components/profilepicture_components/UploadProfilePicture";
import SafeArea from "../../../components/SafeArea";

const ChangeProfilePicture = () => {
  const [label] = useState<string>("");
  const { userId } = useAuthentication();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { addToast } = useToast();
  const { updateTimestamp } = useProfilePictureUpdater();

  const handleSubmitPicture = async () => {
    await uploadProfileImageRequest(userId, imageUri)
      .then(() => {
        updateTimestamp();
        router.back();
      })
      .catch((error) => {
        addToast({ message: "Der skete en fejl under upload af billede", type: "error" });
      });
  };

  return (
    <SafeArea>
      <FormContainer style={styles.container}>
        <View style={styles.profileContainer}>
          {imageUri ? (
            <UploadProfilePicture style={styles.mainProfilePicture} label={label} imageURI={imageUri} />
          ) : (
            <ProfilePicture style={styles.mainProfilePicture} label={label} userId={userId} />
          )}
        </View>
        <CameraButton style={{ bottom: ScaleSizeH(230) }} onImageSelect={setImageUri} />
        <SecondaryButton
          style={{ backgroundColor: colors.green }}
          label="Upload billede"
          disabled={!imageUri}
          onPress={handleSubmitPicture}
        />
        <SecondaryButton label="Gå tilbage" onPress={() => router.back()} />
      </FormContainer>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: ScaleSizeH(30),
    marginBottom: ScaleSizeH(20),
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ScaleSizeH(20),
  },
  mainProfilePicture: {
    width: "100%",
    maxHeight: ScaleSizeH(360),
    aspectRatio: 1,
    borderRadius: 10000,
    marginBottom: ScaleSizeH(140),
  },
});

export default ChangeProfilePicture;
