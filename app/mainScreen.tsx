import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Weekplanner</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Foodplanner </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6ba239',
  },
  button: {
    backgroundColor: '#71d219',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default MainScreen;
