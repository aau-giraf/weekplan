import { openCamera } from "../components/Camera/Camera"; // Import the function to be tested
import * as ImagePicker from 'expo-image-picker'; // Import the ImagePicker for mocking

// Mock the expo-image-picker library to control its behavior in tests
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(), // Mock the permission request function
  launchCameraAsync: jest.fn(), // Mock the camera launch function
  MediaTypeOptions: { Images: 'Images' } // Mock for MediaTypeOptions
}));

describe("openCamera", () => {
  // Clear mocks before each test to ensure a clean slate
  beforeEach(() => {
    jest.clearAllMocks(); // Clears any previous mock calls between tests
  });

  it("should request camera permissions", async () => {
    // Simulate granted permission
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });

    // Call the function being tested
    await openCamera();

    // Verify the permission request was called
    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
  });

  it("should alert if permission is denied", async () => {
    // Simulate denied permission
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: false });

    // Mock the global alert function
    global.alert = jest.fn();

    // Call the function being tested
    await openCamera();

    // Verify the alert was called with the expected message
    expect(global.alert).toHaveBeenCalledWith("Camera access is required to take a photo!");
  });

  it("should launch camera if permission is granted", async () => {
    // Simulate granted permission
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });

    // Mock the launchCameraAsync to return a mock result
    const mockCameraResult = {
      canceled: false, // Simulate that the camera operation was not canceled
      assets: [{ uri: 'mockImageUri' }], // Provide a mock image URI
    };
    ImagePicker.launchCameraAsync.mockResolvedValue(mockCameraResult);

    // Call the function being tested
    const uri = await openCamera();

    // Verify the camera launch function was called and returned the correct URI
    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    expect(uri).toBe('mockImageUri');
  });
});
