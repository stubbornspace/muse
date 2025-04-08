import { Platform } from 'react-native';

export const globalStyles = {
  padding: {
    horizontal: Platform.isPad ? 90 : 10,
    vertical: Platform.isPad ? 60 : 10,
    bottom: 60,
  },
  fontSize: {
    default: 20,
    title: 28,
  },
  colors: {
    text: '#fff',
    background: 'rgba(0, 0, 0, 0.7)',
    overlay: 'rgba(255, 255, 255, 0.1)',
  },
}; 