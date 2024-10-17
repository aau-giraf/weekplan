import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [username, setUsername] = useState('Omar'); //TODO: Get user/username from backend database

  return (
    <View style={styles.app}>
      <ImageBackground
        source={require('../assets/backgroundImage.png')}
        resizeMode="cover"
        style={styles.app}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Welcome {username}</Text>
          <Text style={styles.underTitle}>
            Press below to view your schedule
          </Text>
          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonContent}>
              <Image
                source={require('../assets/weekplanIcon.png')}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Week Planner</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonContent}>
              <Image
                source={require('../assets/foodplanIcon.png')}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Food Planner</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    backgroundColor: '#fff49b',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: width * 0.9,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 5,
  },
  underTitle: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#B7E2D8',
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    marginVertical: 8,
    width: width * 0.8,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 22,
    marginLeft: 10,
  },
  icon: {
    resizeMode: 'contain',
    width: width * 0.15,
    height: width * 0.15,
  },
});

export default LoginScreen;
