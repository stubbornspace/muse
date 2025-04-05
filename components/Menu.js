import React from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Animated } from 'react-native';
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
  hideMenuButton = false,
  isPlaying,
  togglePlayback
}) => {
  const [slideAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible]);

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
        setMenuVisible(false);
      }
    }
  ];

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
            styles.dropdownContainer,
            { 
              opacity: slideAnim,
              transform: [
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.menuSpacer} />
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
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    width: 60,
    backgroundColor: 'transparent',
    padding: 10,
    zIndex: 100,
  },
  menuSpacer: {
    height: 10,
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