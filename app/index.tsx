import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from "../components/SplashScreen";

const HomePage: React.FC = () => {
  const navigation = useNavigation();
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
    /*<View>
        <Text>Home Page</Text>
        <Link href="/weekplanscreen">
          <Text>Gå til ugeplan</Text>
        </Link>
      </View>
    );*/
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Link href="/example" style={styles.link}>
        <Text style={styles.link}>Gå til Example Page</Text>
      </Link>
      <Link href="loginscreen" style={styles.link}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('loginscreen')}
        >
          <Text style={styles.buttonText}>Gå til Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

// Styles for the HomePage component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A7C6ED',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  link: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#B7E2D8',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#4A4A4A',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default HomePage;
