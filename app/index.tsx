import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Link href="/example" style={styles.link}>
        <Text style={styles.link}>Go to Example Page</Text>
      </Link>
      <Link href="/login" style={styles.link}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Login Page</Text>
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
