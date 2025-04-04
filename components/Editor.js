import React from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';

const Editor = ({ selectedNote, setSelectedNote, notes, setNotes }) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.editorContainer}>
        <TextInput
          style={styles.titleInput}
          value={selectedNote.title}
          onChangeText={(text) => {
            const updatedNotes = notes.map(note =>
              note.id === selectedNote.id
                ? { ...note, title: text }
                : note
            );
            setNotes(updatedNotes);
            setSelectedNote({ ...selectedNote, title: text });
          }}
        />
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
    padding: 15,
    alignItems: 'center',
  },
  titleInput: {
    padding: 15,
    fontSize: 32,
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
    width: '100%',
    maxWidth: 800,
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