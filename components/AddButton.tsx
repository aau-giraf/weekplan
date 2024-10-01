import React from "react";
import { StyleSheet, Text } from "react-native";
import {Pressable} from "expo-router/build/views/Pressable";
import {Link, useRouter} from "expo-router";

interface AddButtonProps {
    label: string;
    pathname: `./${string}` | `../${string}` | `${string}:${string}`;
    params: Record<string, any>;
}

const AddButton: React.FC<AddButtonProps> = ({ label, pathname, params}) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(
            {
                pathname,
                params
            }
        );
    }

    return(
        <Pressable style={styles.button} onPress={handlePress}>
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#B0BEC5',
        borderRadius: 30,
        bottom: 20,
        right: 24,
        position: 'absolute',
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        padding: 10,
        color: '#263238'
    }
})

export default AddButton;