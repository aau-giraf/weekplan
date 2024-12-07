import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { colors } from "../../../../utils/SharedStyles";
import useInvitation from "../../../../hooks/useInvitation";
import { useLocalSearchParams } from "expo-router";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import FormContainer from "../../../../components/forms/FormContainer";
import FormHeader from "../../../../components/forms/FormHeader";
import FormField from "../../../../components/forms/TextInput";
import SubmitButton from "../../../../components/forms/SubmitButton";
import { Fragment } from "react";
import { KeyboardAvoidingView } from "react-native";
import SafeArea from "../../../../components/SafeArea";

const invitationSchema = z.object({
  email: z.string().email("Indtast en gyldig e-mailadresse"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

const CreateInvitationPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    mode: "onChange",
  });

  const { createInvitation } = useInvitation();
  const { orgId } = useLocalSearchParams();
  const { userId } = useAuthentication();
  const { addToast } = useToast();

  const onSubmit = async (data: InvitationFormData) => {
    const { email } = data;
    if (!userId) {
      addToast({ message: "Fejl: Du er ikke logget ind", type: "error" });
      return;
    }
    createInvitation
      .mutateAsync({
        orgId: Number(orgId),
        receiverEmail: email,
        senderId: userId,
      })
      .then(() => {
        addToast({ message: "Invitation oprettet", type: "success" });
      })
      .catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
  };

  return (
    <Fragment>
      <SafeArea />
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <FormContainer style={{ padding: 20, backgroundColor: colors.white }}>
          <FormHeader title="Opret Invitation" />
          <FormField control={control} name="email" placeholder="Modtager E-mail" />
          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit(onSubmit)}
            label="Opret Invitation"
          />
        </FormContainer>
      </KeyboardAvoidingView>
    </Fragment>
  );
};

export default CreateInvitationPage;
