import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, StyleSheet, View, Text } from "react-native";
import usePictogram from "../../../../../hooks/usePictogram";
import CameraButton from "../../../../../components/CameraButton";
import FormContainer from "../../../../../components/forms/FormContainer";
import { ProfilePicture } from "../../../../../components/ProfilePicture";
import { colors, ScaleSize, ScaleSizeH } from "../../../../../utils/SharedStyles";
import { useToast } from "../../../../../providers/ToastProvider";
import FormField from "../../../../../components/forms/TextInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "../../../../../components/forms/SubmitButton";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = z.object({
  piktogramURI: z.string().nonempty("Piktogramnavn må ikke være tomt"),
  name: z.string().nonempty("Navn må ikke være tomt"),
});

type UploadPictogramForm = z.infer<typeof schema>;

const UploadPictogram = () => {
  const { uploadpictogram } = useLocalSearchParams();
  const organisationId = Number(uploadpictogram);
  const { uploadNewPictogram } = usePictogram(organisationId);
  const { addToast } = useToast();

  const {
    control,
    formState: { isSubmitting, isValid },
    getValues,
    setValue,
  } = useForm<UploadPictogramForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleSubmitPicture = async () => {
    const imageData = {
      uri: getValues().piktogramURI,
      type: "image/jpeg",
      name: "profile.jpg",
    };

    const formData = new FormData();
    const blob = await fetch(imageData.uri).then((r) => r.blob());

    formData.append("image", blob);
    formData.append("organizationId", organisationId.toString());
    formData.append("pictogramName", getValues().name);

    uploadNewPictogram
      .mutateAsync(formData)
      .then(() => {
        addToast({ message: "Billede blev uploadet", type: "success" });
        router.back();
      })
      .catch((e) => {
        console.log(e.message);
        addToast({ message: "Der skete en fejl", type: "error" });
      });
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <FormContainer style={styles.stepContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.pictureWrapper}>
              {getValues("piktogramURI") ? (
                <ProfilePicture
                  style={styles.mainProfilePicture}
                  label={"N A"}
                  imageURI={getValues("piktogramURI")}
                  key={getValues("piktogramURI")}
                />
              ) : (
                <View style={styles.emptyPictureBorder}>
                  <Text style={styles.pictureText}>Intet valgt billede</Text>
                </View>
              )}
              <CameraButton
                absolute={false}
                style={styles.cameraButton}
                onImageSelect={(uri: string) => setValue("piktogramURI", uri, { shouldValidate: true })}
              />
            </View>
          </View>
          <FormField control={control} name="name" />
          <SubmitButton
            label="Upload billede"
            isSubmitting={isSubmitting}
            isValid={isValid}
            handleSubmit={handleSubmitPicture}
          />
        </FormContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSizeH(30),
    marginBottom: ScaleSizeH(10),
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pictureWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPictureBorder: {
    aspectRatio: 1,
    height: ScaleSizeH(350),
    borderRadius: 10000,
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGray,
  },
  pictureText: {
    fontSize: 20,
    color: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  mainProfilePicture: {
    width: "100%",
    maxHeight: ScaleSizeH(350),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  cameraButton: {
    bottom: ScaleSize(100),
    right: ScaleSize(-100),
  },
});

export default UploadPictogram;
