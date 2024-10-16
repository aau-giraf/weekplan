import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [login, setLogin] = useState({ username: '', password: '' });
  const navigation = useNavigation();

  const handleInput = (field, value) => {
    setLogin((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleLogin = () => {
    navigation.navigate('mainScreen');
    // Put backend auth here with implementing
  };

  const handleForgotPassword = () => {
    // Todo
  };


  return (
  <View style={styles.app}>
  <ImageBackground source={require('../assets/backgroundImage.png')} resizeMode='cover' style={styles.app}>
    <View style={styles.logincontainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={login.username}
        onChangeText={(value) => handleInput('username', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={login.password}
        onChangeText={(value) => handleInput('password', value)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
      <Image
        style={styles.image}
        source={require('../assets/giraffe_ex1.png')}
      />
  </ImageBackground>
  </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9EBAE',
    width: '100%',
  },
  logincontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 300,
    width: 250,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#000000',
    marginLeft: 10,
  },
  image: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 200,
    resizeMode: 'contain',
    zIndex: 1,
    right: -20,
  },
});

export default LoginPage;
