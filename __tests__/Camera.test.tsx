import { takePhoto } from "../components/Camera/Camera";
import * as ImagePicker from 'expo-image-picker';

// Mock the expo-image-picker library to control its behavior in tests
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' }
}));

describe("takePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should request camera permissions", async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });

    await takePhoto();

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
  });

  it("should alert if permission is denied", async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: false });
    global.alert = jest.fn();
    await takePhoto();

    expect(global.alert).toHaveBeenCalledWith("Camera access is required to take a photo!");
  });

  it("should launch camera if permission is granted", async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });

    const mockCameraResult = {
      canceled: false,
      assets: [{ uri: 'mockImageUri' }],
    };
    ImagePicker.launchCameraAsync.mockResolvedValue(mockCameraResult);

    const uri = await takePhoto();

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    expect(uri).toBe('mockImageUri');
  });
});
