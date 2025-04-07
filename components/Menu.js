import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Modal, Text, Alert } from 'react-native';
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
  isVisible,
  toggleChat,
  isChatVisible
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = !selectedNote ? [
    { icon: "add-circle-outline", onPress: () => {
      addNote();
      setIsDropdownOpen(false);
    }},
    { icon: isPlaying ? "musical-notes" : "musical-notes-outline", onPress: () => {
      togglePlayback();
      setIsDropdownOpen(false);
    }},
    { icon: "chatbubble-outline", onPress: () => {
      toggleChat();
      setIsDropdownOpen(false);
    }}
  ] : [
    { icon: "save-outline", onPress: () => {
      saveNote();
      setIsDropdownOpen(false);
    }},
    { icon: "download-outline", onPress: () => {
      exportNote();
      setIsDropdownOpen(false);
    }},
    { icon: "trash-outline", onPress: () => {
      handleDelete();
    }},
    { icon: isPlaying ? "musical-notes" : "musical-notes-outline", onPress: () => {
      togglePlayback();
      setIsDropdownOpen(false);
    }},
    { icon: "chatbubble-outline", onPress: () => {
      toggleChat();
      setIsDropdownOpen(false);
    }},
    { 
      icon: "home-outline", 
      onPress: () => {
        setSelectedNote(null);
        setIsDropdownOpen(false);
      }
    }
  ];

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            confirmDelete();
            setIsDropdownOpen(false);
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="menu" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.dropdownItem} 
                onPress={item.onPress}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 100,
  },
  menuButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 120,
    right: 15,
  },
  dropdownItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
  },
});

export default Menu; 