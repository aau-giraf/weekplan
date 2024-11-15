import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { colors } from "../../../../utils/SharedStyles";
import useInvitation from "../../../../hooks/useInvitation";
import { useLocalSearchParams } from "expo-router";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import FormContainer from "../../../../components/Forms/FormContainer";
import FormHeader from "../../../../components/Forms/FormHeader";
import FormField from "../../../../components/Forms/TextInput";
import SubmitButton from "../../../../components/Forms/SubmitButton";
import { Fragment } from "react";
import { SafeAreaView } from "react-native";

const invitationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
      addToast({ message: "Du er ikke logget ind", type: "error" });
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
      <SafeAreaView style={{ backgroundColor: colors.white }} />
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
    </Fragment>
  );
};

export default CreateInvitationPage;
