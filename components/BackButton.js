import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ setSelectedNote, onCloseChat, isChatVisible }) => {
  const handlePress = () => {
    if (isChatVisible) {
      onCloseChat();
    } else {
      setSelectedNote(null);
    }
  };

  return (
    <View style={styles.backContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    position: 'absolute',
    top: 60,
    left: 15,
    zIndex: 100,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 30,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton; 