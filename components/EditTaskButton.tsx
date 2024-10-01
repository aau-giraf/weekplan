import React from "react";
import {Button, Modal, Text, TextInput, View, StyleSheet, ScrollView, Pressable} from "react-native";
import TimeCalender from "./TimeCalender";
import ImagePickerSelector from "./ImagePickerSelector";

type EditTaskButtonProps = {
    label: string,
}

const EditTaskButton:React.FC<EditTaskButtonProps> = (props) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <View>
            <Button onPress={() => setShowModal(true)} title="Edit Task" />
            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Task</Text>
                            <TextInput style={styles.input}>{props.label}</TextInput>
                            <ImagePickerSelector/>
                            <TimeCalender/>
                            <Button title="Save" onPress={() => setShowModal(false)} />
                        </View>
                    </ScrollView>
                </View>
                <Pressable onPress={() => {setShowModal(false)}}></Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        maxHeight: '100%',
        maxWidth: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
});

export default EditTaskButton;