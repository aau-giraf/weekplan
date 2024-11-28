import { Stack } from "expo-router";
import DateProvider from "../../providers/DateProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WeekplanProvider from "../../providers/WeekplanProvider";

/*
The paths will be updated automatically updated within the .expo/types/router.d.ts everytime expo runs.
If the paths have not been updated then you may experience errors according to your IDE 
For instance, it may require you to write router.push(".index"), instead of just router.push("index") if routes have not yet been updated.
*/

const AuthRootLayout = () => {
  return (
    <GestureHandlerRootView>
      <WeekplanProvider>
        <DateProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="profile/profilepage" />
            <Stack.Screen name="profile/settings" />
            <Stack.Screen name="profile/editprofile" />
            <Stack.Screen name="profile/viewinvitation" />
            <Stack.Screen name="profile/changepassword" />
            <Stack.Screen name="profile/changeprofilepicture" />
            <Stack.Screen name="profile/deleteprofile" />
            <Stack.Screen name="profile/organisation/viewpictograms/[viewpictograms]" />
            <Stack.Screen name="profile/organisation/uploadpictogram/[uploadpictogram]" />
            <Stack.Screen name="profile/organisation/[organisation]" />
            <Stack.Screen name="profile/organisation/addactivity" />
            <Stack.Screen name="profile/organisation/addcitizen" />
            <Stack.Screen name="profile/organisation/editactivity" />
            <Stack.Screen name="profile/organisation/editorganisation" />
            <Stack.Screen name="profile/organisation/settings" />
            <Stack.Screen name="profile/organisation/weekplanscreen" />
            <Stack.Screen name="profile/organisation/create-invitation" />
            <Stack.Screen name="profile/organisation/members/[members]" />
            <Stack.Screen name="profile/organisation/citizens/[citizens]" />
            <Stack.Screen name="profile/organisation/grade/[grade]" />
            <Stack.Screen name="profile/organisation/grade/addcitizen" />
            <Stack.Screen name="profile/organisation/grade/removecitizen" />
            <Stack.Screen name="profile/organisation/grade/settings" />
            <Stack.Screen name="profile/organisation/grade/editgrade" />
          </Stack>
        </DateProvider>
      </WeekplanProvider>
    </GestureHandlerRootView>
  );
};

export default AuthRootLayout;
