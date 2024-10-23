import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import SplashScreen from "../components/SplashScreen";

const HomePage: React.FC = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <View>
      <Text>Home Page</Text>
      <Link href="/weekplanscreen">
        <Text>Gå til ugeplan</Text>
      </Link>
    </View>
  );
};

export default HomePage;
