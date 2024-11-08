import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import SubmitButton from "../components/Forms/SubmitButton";
import FormField from "../components/Forms/TextInput";
import { ProfilePicture } from "../components/ProfilePage";
import SwipeableList from "../components/SwipeableList/SwipeableList";
import useOrganisation from "../hooks/useOrganisation";
import { colors } from "../utils/SharedStyles";

const citizenSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long").max(20),
  lastName: z.string().min(2, "Last name must be at least 2 characters long").max(20),
});

type CitizenData = z.infer<typeof citizenSchema>;

type CitizenFormProps = {
  onSubmit: (data: { value: CitizenData }) => void;
};

const CitizenForm: React.FC<CitizenFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<CitizenData>({
    resolver: zodResolver(citizenSchema),
    mode: "onChange",
  });

  const onFormSubmit = async (data: CitizenData) => {
    onSubmit({ value: data });
  };

  return (
    <View>
      <Text style={styles.title}>Tilføj borger</Text>
      <FormField control={control} name="firstName" placeholder="Fornavn" />
      <FormField control={control} name="lastName" placeholder="Efternavn" />
      <SubmitButton isValid={isValid} isSubmitting={isSubmitting} handleSubmit={handleSubmit(onFormSubmit)} />
    </View>
  );
};

type Citizen = {
  firstName: string;
  lastName: string;
  id: number;
};

const AddCitizen: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const { createCitizen, deleteCitizen } = useOrganisation(1);

  const handleAddCitizen = async ({ value }: { value: CitizenData }) => {
    const realId = await createCitizen.mutateAsync({
      firstName: value.firstName,
      lastName: value.lastName,
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
      <ProfilePicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
      <Text numberOfLines={3} style={{ flexShrink: 1 }}>
        {`${item.firstName} ${item.lastName}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
              <Text style={styles.title}>List over nyligt tilføjede</Text>
            </>
          ),
          ItemSeparatorComponent: () => <View style={{ height: 10 }} />,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  citizenContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
  },
  profilePicture: {
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default AddCitizen;
