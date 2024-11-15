import { getImage } from "../utils/getImage";
import * as ImagePicker from "expo-image-picker";

jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: { Images: "Images" },
}));

describe("takePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should request camera permissions", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    await getImage("camera");

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
  });

  it("should alert if permission is denied", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    global.alert = jest.fn();
    await getImage("camera");

    expect(global.alert).toHaveBeenCalledWith("Camera access is required to take a photo!");
  });

  it("should launch camera if permission is granted", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    const mockCameraResult = {
      canceled: false,
      assets: [{ uri: "mockImageUri" }],
    };
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockCameraResult);

    const uri = await getImage("camera");

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    expect(uri).toBe("mockImageUri");
  });
});
