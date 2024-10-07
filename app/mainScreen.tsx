import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const navigation = useNavigation();

  return (
      <View style={styles.container}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Weekplanner')}
            activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Weekplanner</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Foodplanner')}
            activeOpacity={0.8} 
        >
          <Text style={styles.buttonText}>Foodplanner</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A7C6ED',
  },
  button: {
    backgroundColor: '#B7E2D8',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#4A4A4A',
    textAlign: 'center',
    fontSize: 22,
  },
});

export default MainScreen;
