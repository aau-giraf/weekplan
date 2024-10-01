import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import pickImage from "../utils/pickImage";

const ImagePickerSelector = () => {
    const [image, setImage] = useState<string | null>(null);

    const handlePickImage = async () => {
        const result = await pickImage();
        if (result) {
            setImage(result);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Vælg et billede i dit billede bibliotek" onPress={handlePickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default ImagePickerSelector;