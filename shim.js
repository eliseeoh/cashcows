import { Platform } from 'react-native';
if (Platform.OS === 'web') {
  // If running in a web environment
  global.punycode = require('punycode');
} else {
  // Otherwise, create a mock implementation
  global.punycode = {
    encode: (input) => input,
    decode: (input) => input,
  };
}