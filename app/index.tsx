import React, { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import { router } from "expo-router";

const HomePage: React.FC = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSplashVisible) {
      router.replace("/login");
    }
  }, [isSplashVisible]);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return null;
};

export default HomePage;

