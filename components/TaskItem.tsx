import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaskItemProps {
    time: string;
    label: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ time, label }) => {
    return (
        <View style={styles.taskContainer}>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.labelText}>{label}</Text>
            <View style={styles.iconContainer}>
                <Text style={styles.iconPlaceholderText}>Photo</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#A5D6A7',
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#E3F2FD',
    },
    timeText: {
        color: '#37474F',
        fontSize: 16,
        flex: 1,
    },
    labelText: {
        color: '#37474F',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFCC80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconPlaceholderText: {
        color: '#000',
        fontSize: 12,
    },
});

export default TaskItem;
