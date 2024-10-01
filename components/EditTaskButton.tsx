import React from "react";
import { View, Button, Modal, StyleSheet, ScrollView, TextInput, Text, Pressable } from "react-native";
import TimeCalender from "./TimeCalender";
import ImagePickerSelector from "./ImagePickerSelector";

type EditTaskButtonProps = {
    label: string,
};

const EditTaskButton: React.FC<EditTaskButtonProps> = (props) => {
    const [showModal, setShowModal] = React.useState(false);
    const [newTitle, setNewTitle] = React.useState(props.label);
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());

    const handleTimeChange = (start: Date, end: Date) => {
        setStartTime(start);
        setEndTime(end);
    };

    const handleSubmit = () => {
        console.log("Title: ", newTitle);
        console.log("Start time: ", startTime);
        console.log("End time: ", endTime);
    };

    return (
        <View>
            <Button onPress={() => setShowModal(true)} title="Ændre Aktivitet" />
            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Ændre Aktivitet</Text>
                            <TextInput value={newTitle} style={styles.input} onChangeText={(text) => setNewTitle(text)} />
                            <ImagePickerSelector />
                            <TimeCalender onTimeChange={handleTimeChange} />
                            <Button title="Gem" onPress={() => { handleSubmit(); setShowModal(false); }} />
                        </View>
                    </ScrollView>
                </View>
                <Pressable onPress={() => { setShowModal(false); }}></Pressable>
            </Modal>
        </View>
    );
};

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