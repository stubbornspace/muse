import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../config/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBot = ({ isVisible, onClose, onCopyToEditor }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save messages to history when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('chatHistory');
      if (history) {
        setMessages(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to delete all chat messages? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('chatHistory');
              setMessages([]);
              Alert.alert('Success', 'Chat history cleared');
            } catch (error) {
              console.error('Error clearing chat history:', error);
              Alert.alert('Error', 'Failed to clear chat history');
            }
          }
        }
      ]
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Get API key from AsyncStorage
      const apiKey = await AsyncStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Please add your API key in Settings.');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful writing assistant." },
            ...messages,
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }

      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to get response from AI. Please check your API key configuration.'
      );
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key configuration in Settings.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.title}>Ask HAL</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.message, 
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
            {message.role === 'assistant' && (
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => onCopyToEditor(message.content)}
              >
                <Ionicons name="copy-outline" size={20} color={globalStyles.colors.text} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={globalStyles.colors.text} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={isLoading}
        >
          <Ionicons name="send" size={24} color={globalStyles.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearChatHistory}
        >
          <Ionicons name="trash-outline" size={24} color={globalStyles.colors.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  placeholder: {
    width: 34,
  },
  title: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.title,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: globalStyles.padding.horizontal,
    paddingVertical: globalStyles.padding.vertical,
  },
  message: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.default,
    paddingRight: 60,
  },
  copyButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    padding: 5,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: globalStyles.padding.bottom,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: globalStyles.colors.text,
    marginRight: 10,
    maxHeight: 100,
    fontSize: globalStyles.fontSize.default,
  },
  sendButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clearButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot; 