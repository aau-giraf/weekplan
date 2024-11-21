import { View, StyleSheet, SafeAreaView } from "react-native";
import { ProfilePicture } from "../../../components/ProfilePicture";
import CameraButton from "../../../components/CameraButton";
import SecondaryButton from "../../../components/forms/SecondaryButton";
import { colors, ScaleSizeH } from "../../../utils/SharedStyles";
import { router } from "expo-router";
import React, { useState } from "react";
import { uploadProfileImageRequest } from "../../../apis/profileAPI";
import { useToast } from "../../../providers/ToastProvider";
import FormContainer from "../../../components/forms/FormContainer";
import { useAuthentication } from "../../../providers/AuthenticationProvider";

const ChangeProfilePicture = () => {
  const [label] = useState<string>("");
  const { userId } = useAuthentication();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleSubmitPicture = async () => {
    await uploadProfileImageRequest(userId, imageUri)
      .then(() => {
        router.back();
      })
      .catch((error) => {
        addToast({ message: "Der skete en fejl under upload af billede", type: "error" });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <FormContainer style={styles.container}>
        <View style={styles.profileContainer}>
          <ProfilePicture
            style={styles.mainProfilePicture}
            label={label}
            userId={userId}
            imageURI={imageUri}
            key={imageUri}
          />
        </View>
        <CameraButton style={styles.cameraButton} onImageSelect={setImageUri} />
        <SecondaryButton
          style={{ backgroundColor: colors.green }}
          label="Upload billede"
          disabled={!imageUri}
          onPress={handleSubmitPicture}
        />
        <SecondaryButton label="Gå tilbage" onPress={() => router.replace("/auth/profile/settings")} />
      </FormContainer>
    </SafeAreaView>
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
  cameraButton: {
    bottom: ScaleSizeH(230),
  },
});

export default ChangeProfilePicture;
