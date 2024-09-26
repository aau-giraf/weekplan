import { Link } from 'expo-router';
import { View, Text } from 'react-native';

const HomePage = () => {
  return (
    <View>
      <Text>Home Page</Text>
      <Link href="/example">
        <Text>Go to example Page</Text>
      </Link>
      <Link href="/login">
        <button>Go to login Page</button>
      </Link>
    </View>
  );
};

export default HomePage;
