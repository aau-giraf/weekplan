import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const rem = 0.0015 * width + 0.4;

export default rem;
