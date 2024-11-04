import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors, SharedStyles } from "../../utils/SharedStyles";
import { UserDTO } from "../../DTO/organisationDTO";

type MemberModalProps = {
  visible: boolean;
  toggleVisible: (visible: boolean) => void;
  members: UserDTO[];
};

const MemberModal = ({ visible, toggleVisible, members }: MemberModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => toggleVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => toggleVisible(false)}
      >
        <ScrollView
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          {members.map((member: UserDTO) => (
            <MemberModalEntry />
          ))}
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

const MemberModalEntry = () => {
  return <View></View>;
};

const styles = StyleSheet.create({
  modalContainer: {
    ...SharedStyles.container,
    ...SharedStyles.trueCenter,
    width: "80%",
    height: "80%",
    borderRadius: 10,
    gap: 5,
  },
  modalBackground: {
    ...SharedStyles.trueCenter,
    flex: 1,
    backgroundColor: colors.backgroundBlack,
  },
});
