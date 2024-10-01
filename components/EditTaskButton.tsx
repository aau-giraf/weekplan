import React, {useState} from "react";
import { View, Button, Modal, StyleSheet, ScrollView, TextInput, Text, Pressable } from "react-native";
import TimeCalender from "./TimeCalender";
import ImagePickerSelector from "./ImagePickerSelector";

type EditTaskButtonProps = {
    label: string,
};

type SumbitProps = {
    title: string,
    startTime: Date,
    endTime: Date,
}


const EditTaskButton: React.FC<EditTaskButtonProps> = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [submitProps, setSubmitProps] = useState<SumbitProps>({
        title: props.label,
        startTime: new Date(),
        endTime: new Date(),
    });
    const handleTimeChange = (start: Date, end: Date) => {
        setSubmitProps({
            title: submitProps.title,
            startTime: start,
            endTime: end,
        });
    };

    const handleSubmit = () => {
        console.log(submitProps);
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
                            <TextInput value={submitProps.title} style={styles.input} onChangeText={(text) =>
                                setSubmitProps({
                                    title: text,
                                    startTime: submitProps.startTime,
                                    endTime: submitProps.endTime,
                                })} />
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