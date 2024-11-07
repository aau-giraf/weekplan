import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { colors } from "../utils/SharedStyles";
import { ProfilePicture } from "../components/ProfilePage";
import ReanimatedSwipeable from "../components/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import useOrganisation from "../hooks/useOrganisation";
import FieldInputText from "../components/InputValidation/FieldInputText";
import FieldSubmitButton from "../components/InputValidation/FieldSumbitButton";

const citizenSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(20),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(20),
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
      <View style={styles.inputContainer}>
        <Text>Fornavn:</Text>
        <FieldInputText
          form={form}
          formName="firstName"
          placeholder="Fornavn"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Efternavn:</Text>
        <FieldInputText
          form={form}
          formName="lastName"
          placeholder="Efternavn"
        />
      </View>
      <FieldSubmitButton form={form} text={"Tilføj borger"} />
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
    <ReanimatedSwipeable onSwipeableWillOpen={() => handleDelete(item.id)}>
      <View style={styles.citizenContainer}>
        <ProfilePicture
          label={`${item.firstName} ${item.lastName}`}
          style={styles.profilePicture}
        />
        <Text numberOfLines={3} style={{ flexShrink: 1 }}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </View>
    </ReanimatedSwipeable>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        style={{ padding: 20 }}
        data={citizens}
        itemLayoutAnimation={
          Platform.OS === "android" ? undefined : LinearTransition
        }
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <CitizenForm onSubmit={handleAddCitizen} />
            <Text style={styles.title}>List over nyligt tilføjede</Text>
          </>
        }
        renderItem={({ item }) => renderCitizen(item)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
