import React, { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import LoginScreen from "../components/Login";

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

  return <LoginScreen />;
};

export default HomePage;
