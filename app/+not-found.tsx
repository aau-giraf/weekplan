import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Fejl! Kunne ikke finde siden" }} />
      <View style={styles.container}>
        <Link href="/">Fejl! Kunne ikke finde siden klik for at gå tilage</Link>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
