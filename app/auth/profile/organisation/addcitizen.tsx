import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import SwipeableList from "../../../../components/swipeablelist/SwipeableList";
import SubmitButton from "../../../../components/forms/SubmitButton";
import FormField from "../../../../components/forms/TextInput";
import useOrganisation from "../../../../hooks/useOrganisation";
import { CitizenSharedStyles, colors, ScaleSize } from "../../../../utils/SharedStyles";
import FormContainer from "../../../../components/forms/FormContainer";
import FormHeader from "../../../../components/forms/FormHeader";
import { useForm } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { InitialsPicture } from "../../../../components/profilepicture_components/InitialsPicture";
import SafeArea from "../../../../components/SafeArea";

const citizenSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Fornavn skal være mindst 2 karakterer langt")
    .max(20, "Fornavn må højst være 20 karakterer langt"),
  lastName: z
    .string()
    .trim()
    .min(2, "Efternavn skal være mindst 2 karakterer langt")
    .max(20, "Efternavn må højst være 20 karakterer langt"),
});

type CitizenData = z.infer<typeof citizenSchema>;

type CitizenFormProps = {
  onSubmit: (data: { value: CitizenData }) => void;
};

const CitizenForm: React.FC<CitizenFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<CitizenData>({
    resolver: zodResolver(citizenSchema),
    mode: "onChange",
  });

  const onFormSubmit = async (data: CitizenData) => {
    reset();
    onSubmit({ value: data });
  };

  return (
    <FormContainer>
      <FormHeader title={"Tilføj borger"} />
      <FormField control={control} name="firstName" placeholder="Fornavn" />
      <FormField control={control} name="lastName" placeholder="Efternavn" />
      <SubmitButton
        isValid={isValid}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onFormSubmit)}
        label={"Tilføj borger"}
      />
    </FormContainer>
  );
};

type Citizen = {
  firstName: string;
  lastName: string;
  id: number;
};

const AddCitizen: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const { orgId } = useLocalSearchParams();
  const { createCitizen, deleteCitizen } = useOrganisation(Number(orgId));

  const handleAddCitizen = async ({ value }: { value: CitizenData }) => {
    const realId = await createCitizen.mutateAsync({
      firstName: value.firstName,
      lastName: value.lastName,
      activities: [],
    });
    setCitizens((prev) => [{ ...value, id: realId }, ...prev]);
  };

  const handleDelete = useCallback(
    async (citizenId: number) => {
      setCitizens((prev) => prev.filter((citizen) => citizen.id !== citizenId));
      await deleteCitizen.mutateAsync(citizenId);
    },
    [deleteCitizen]
  );

  const renderCitizen = (item: Citizen) => (
    <View style={styles.citizenContainer}>
      <InitialsPicture
        label={`${item.firstName} ${item.lastName}`}
        style={styles.profilePicture}
        fontSize={ScaleSize(75)}
      />
      <Text numberOfLines={3} style={{ flexShrink: 1 }}>
        {`${item.firstName} ${item.lastName}`}
      </Text>
    </View>
  );

  return (
    <Fragment>
      <SafeArea />
      <View style={CitizenSharedStyles.citizenContainer}>
        <SwipeableList
          style={{ padding: 20 }}
          items={citizens}
          renderItem={({ item }) => renderCitizen(item)}
          keyExtractor={(item) => item.id.toString()}
          reanimatedSwipeableProps={(item) => ({
            onSwipeableWillOpen: () => handleDelete(item.id),
          })}
          flatListProps={{
            ListHeaderComponent: (
              <>
                <CitizenForm onSubmit={handleAddCitizen} />
                <FormHeader
                  style={{ textAlign: "left", fontSize: ScaleSize(35), marginVertical: 20 }}
                  title={"Liste over nyligt tilføjede"}
                />
              </>
            ),
            ItemSeparatorComponent: () => <View style={{ height: 10 }} />,
          }}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  citizenContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  profilePicture: {
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default AddCitizen;
