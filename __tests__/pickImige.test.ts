import pickImage from '../utils/pickImage';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

describe('pickImage', () => {
    it('should return the image URI when an image is selected', async () => {
        const mockResult = {
            canceled: false,
            assets: [{ uri: 'test-uri' }],
        };
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

        const result = await pickImage();
        expect(result).toBe('test-uri');
    });

    it('should return undefined when the image selection is canceled', async () => {
        const mockResult = {
            canceled: true,
        };
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

        const result = await pickImage();
        expect(result).toBeUndefined();
    });
});