import {
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import useCopyDayData from "../hooks/useCopyDayData";
import { PlatformDateTimePicker } from "./PlatformDateTimePicker";
import { SelectActivityList } from "./SelectActivityList";
import { useDate } from "../providers/DateProvider";

type CopyDayDataModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CopyDayDataModal = (props: CopyDayDataModalProps) => {
  const { selectedDate } = useDate();
  const {
    modal,
    sourceDate,
    destinationDate,
    external,
    selection,
    submit,
    changeDate,
  } = useCopyDayData(props);

  const closeModal = () => modal.set(false);

  return (
    <Modal
      visible={modal.visible}
      animationType="slide"
      transparent
      onRequestClose={closeModal}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.header}>Kopier Aktiviteter</Text>
          <PlatformDateTimePicker
            platform={Platform.OS}
            startDate={new Date(selectedDate.getTime() - 86400000)}
            callback={(_event, date) => changeDate(date, "source")}
          />
          <Text style={styles.header}>Til Dato</Text>
          <PlatformDateTimePicker
            platform={Platform.OS}
            startDate={selectedDate}
            callback={(_event, date) => changeDate(date, "destination")}
          />
          <SelectActivityList
            activities={external.data ?? []}
            toggleCallback={selection.toggle}
            error={external.error}
          />
          <Button
            title="Kopier Aktiviteter"
            onPress={closeModal}
            disabled={!submit.canSubmit}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "80%",
    height: "80%",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});

export default CopyDayDataModal;
