import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import FieldInfo from "../components/FieldInfo";
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
  const form = useForm({
    onSubmit: (props: { value: CitizenData }) => {
      onSubmit({ value: props.value });
      form.reset();
    },
    validatorAdapter: zodValidator(),
    validators: { onChange: citizenSchema },
  });

  return (
    <View>
      <Text style={styles.title}>Tilføj borger</Text>

      <form.Field
        name="firstName"
        children={(field) => (
          <View style={styles.inputContainer}>
            <Text>Fornavn:</Text>
            <TextInput
              style={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? styles.inputError
                  : styles.input
              }
              placeholder="Fornavn"
              value={field.state.value}
              onChangeText={field.setValue}
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

      <form.Field
        name="lastName"
        children={(field) => (
          <View style={styles.inputContainer}>
            <Text>Efternavn:</Text>
            <TextInput
              style={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? styles.inputError
                  : styles.input
              }
              placeholder="Efternavn"
              value={field.state.value}
              onChangeText={field.setValue}
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <TouchableOpacity
            style={canSubmit ? styles.button : styles.buttonDisabled}
            disabled={!canSubmit}
            onPress={form.handleSubmit}>
            <Text style={styles.buttonText}>{isSubmitting ? "..." : "Tilføj borger"}</Text>
          </TouchableOpacity>
        )}
      />
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
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 4,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
    padding: 8,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.green,
    marginTop: 10,
  },
  buttonDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "gray",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  profilePicture: {
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default AddCitizen;
