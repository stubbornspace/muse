import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../config/styles';

const Settings = ({ isVisible, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadApiKey();
    }
  }, [isVisible]);

  const loadApiKey = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('openai_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('openai_api_key', apiKey.trim());
      Alert.alert('Success', 'API key saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const clearApiKey = async () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to clear your API key?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('openai_api_key');
              setApiKey('');
              Alert.alert('Success', 'API key cleared');
            } catch (error) {
              console.error('Error clearing API key:', error);
              Alert.alert('Error', 'Failed to clear API key');
            }
          }
        }
      ]
    );
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={globalStyles.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OpenAI API Key</Text>
            <Text style={styles.description}>
              Enter your OpenAI API key to enable the AI assistant feature.
            </Text>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your OpenAI API key"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.clearButton]} 
                onPress={clearApiKey}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveApiKey}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.overlay,
    paddingBottom: 10,
  },
  title: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.title,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.default,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: globalStyles.colors.text,
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    color: globalStyles.colors.text,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
  },
  saveButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  buttonText: {
    color: globalStyles.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings; 