import React from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';

const Editor = ({ selectedNote, setSelectedNote }) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.editorContainer}>
        <TextInput
          style={styles.contentInput}
          multiline
          value={selectedNote.content}
          onChangeText={(text) => {
            setSelectedNote({ ...selectedNote, content: text });
          }}
          placeholder="Start typing your note..."
          placeholderTextColor="#888"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 15,
    alignItems: 'center',
  },
  contentInput: {
    flex: 1,
    padding: 15,
    fontSize: 24,
    color: '#fff',
    textAlignVertical: 'top',
    width: '100%',
    maxWidth: 800,
    marginBottom: 60,
  },
});

export default Editor; 