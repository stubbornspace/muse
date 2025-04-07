import React, { useState } from 'react';
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

const ChatBot = ({ isVisible, onClose, onCopyToEditor }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Check if API key is available
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured');
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
        'Failed to get response from AI. Please check your API key configuration.'
      );
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key configuration.' 
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
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={globalStyles.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>HAL3000</Text>
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: globalStyles.padding.horizontal,
    paddingVertical: globalStyles.padding.vertical,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.overlay,
  },
  backButton: {
    padding: 5,
  },
  title: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.title,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 34,
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
    backgroundColor: globalStyles.colors.overlay,
  },
  messageText: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.default,
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
    paddingHorizontal: globalStyles.padding.horizontal,
    paddingVertical: globalStyles.padding.vertical,
    borderTopWidth: 1,
    borderTopColor: globalStyles.colors.overlay,
  },
  input: {
    flex: 1,
    backgroundColor: globalStyles.colors.overlay,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: globalStyles.colors.text,
    marginRight: 10,
    maxHeight: 100,
    fontSize: globalStyles.fontSize.default,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot; 