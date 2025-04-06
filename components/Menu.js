import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Menu = ({ 
  selectedNote, 
  addNote, 
  saveNote, 
  confirmDelete, 
  setSelectedNote,
  exportNote,
  isPlaying,
  togglePlayback,
  isVisible
}) => {
  const menuItems = !selectedNote ? [
    { icon: "add-circle-outline", onPress: addNote },
    { icon: isPlaying ? "musical-notes" : "musical-notes-outline", onPress: togglePlayback }
  ] : [
    { icon: "save-outline", onPress: saveNote },
    { icon: "download-outline", onPress: exportNote },
    { icon: "trash-outline", onPress: confirmDelete },
    { icon: isPlaying ? "musical-notes" : "musical-notes-outline", onPress: togglePlayback },
    { 
      icon: "home-outline", 
      onPress: () => {
        setSelectedNote(null);
      }
    }
  ];

  return (
    <Animated.View 
      style={[
        styles.menuContainer,
        { opacity: isVisible ? 1 : 0 }
      ]}
    >
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem} 
          onPress={item.onPress}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    width: 60,
    backgroundColor: 'transparent',
    padding: 10,
    zIndex: 100,
  },
  menuItem: {
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Menu; 