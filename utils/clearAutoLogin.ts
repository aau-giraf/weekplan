import * as SecureStore from "expo-secure-store";
import { setSettingsValue } from "./settingsUtils";
const clearAutoLogin = async () => {
  await SecureStore.deleteItemAsync("email");
  await SecureStore.deleteItemAsync("password");
  setSettingsValue("Husk mig", false);
};
export default clearAutoLogin;
