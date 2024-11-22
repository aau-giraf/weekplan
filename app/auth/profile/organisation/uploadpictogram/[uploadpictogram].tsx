import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import usePictogram from "../../../../../hooks/usePictogram";
import CameraButton from "../../../../../components/CameraButton";
import FormContainer from "../../../../../components/forms/FormContainer";
import { ProfilePicture } from "../../../../../components/ProfilePicture";
import { colors, ScaleSizeH } from "../../../../../utils/SharedStyles";
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

  const handleSubmitPicture = () => {
    const imageData = {
      uri: getValues().piktogramURI,
      type: "image/jpeg",
      name: "profile.jpg",
    };

    const formData = new FormData();
    formData.append("image", imageData as unknown as Blob);
    formData.append("organizationId", organisationId.toString());
    formData.append("pictogramName", getValues().name);

    uploadNewPictogram
      .mutateAsync(formData)
      .then(() => {
        addToast({ message: "Billede blev uploadet", type: "success" });
      })
      .catch(() => {
        addToast({ message: "Der skete en fejl", type: "error" });
      });
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: colors.white }}>
      <FormContainer style={styles.stepContainer}>
        <View style={styles.profileContainer}>
          {getValues("piktogramURI") && (
            <ProfilePicture
              style={styles.mainProfilePicture}
              label={"N A"}
              imageURI={getValues("piktogramURI")}
              key={getValues("piktogramURI")}
            />
          )}
        </View>
        <CameraButton
          style={styles.cameraButton}
          onImageSelect={(uri) => setValue("piktogramURI", uri, { shouldValidate: true })}
        />
        <FormField control={control} name="name" />
        <SubmitButton
          label="Upload billede"
          isSubmitting={isSubmitting}
          isValid={isValid}
          handleSubmit={handleSubmitPicture}
        />
      </FormContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
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
    bottom: ScaleSizeH(350),
    position: "relative",
  },
  navigationButtons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
});

export default UploadPictogram;
