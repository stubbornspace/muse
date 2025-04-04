import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Menu = ({ 
  menuVisible, 
  setMenuVisible, 
  selectedNote, 
  addNote, 
  saveNote, 
  confirmDelete, 
  setSelectedNote 
}) => {
  return (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          {!selectedNote ? (
            <TouchableOpacity style={styles.menuItem} onPress={addNote}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>New</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={saveNote}>
                <Ionicons name="save-outline" size={24} color="#fff" />
                <Text style={styles.menuText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={confirmDelete}>
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.menuText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setSelectedNote(null);
                  setMenuVisible(false);
                }}
              >
                <Ionicons name="home-outline" size={24} color="#fff" />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Menu; 