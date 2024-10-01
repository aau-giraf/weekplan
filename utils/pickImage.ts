import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
    //The result object contains information about the selected image
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
        return result.assets[0].uri;
    }
};

export default pickImage;