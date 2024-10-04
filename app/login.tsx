import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
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
    <View style={styles.container}>
      <Text style={styles.title}>Giraf Login</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9EBAE',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '30%',
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
});

export default LoginPage;
