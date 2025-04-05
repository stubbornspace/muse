import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Menu = ({ 
  menuVisible, 
  setMenuVisible, 
  selectedNote, 
  addNote, 
  saveNote, 
  confirmDelete, 
  setSelectedNote,
  exportNote,
  hideMenuButton = false
}) => {
  const [slideAnim] = React.useState(new Animated.Value(300));

  React.useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible]);

  return (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      >
        <Animated.View 
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          
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
              <TouchableOpacity style={styles.menuItem} onPress={exportNote}>
                <Ionicons name="download-outline" size={24} color="#fff" />
                <Text style={styles.menuText}>Export</Text>
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
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'rgba(0, 0, 30, 0.5)',
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 5,
    borderRadius: 5,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  closeButton: {
    padding: 5,
  },
});

export default Menu; 