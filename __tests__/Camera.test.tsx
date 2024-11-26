import { getImage } from "../utils/getImage";
import * as ImagePicker from "expo-image-picker";

jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: { Images: "Images" },
}));

const mockCameraResult = {
  canceled: false,
  assets: [{ uri: "mockImageUri" }],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("takePhoto", () => {
  test("should request for permission to access camera", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockCameraResult);

    await getImage("camera");

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
  });

  test("should alert if permission is denied", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    global.alert = jest.fn();
    await getImage("camera");

    expect(global.alert).toHaveBeenCalledWith("Kamera har brug for adgang til at kunne tage et billede!");
  });

  test("should launch camera if permission is granted", async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockCameraResult);

    const uri = await getImage("camera");

    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    expect(uri).toBe(mockCameraResult);
  });
});
