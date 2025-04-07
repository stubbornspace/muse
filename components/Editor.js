import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { globalStyles } from '../config/styles';

const Editor = ({ selectedNote, setSelectedNote }) => {
  const handleTitleChange = (text) => {
    setSelectedNote({ ...selectedNote, title: text });
  };

  const handleContentChange = (text) => {
    setSelectedNote({ ...selectedNote, content: text });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        value={selectedNote.title}
        onChangeText={handleTitleChange}
        placeholder="Enter title..."
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
      />
      <TextInput
        style={styles.contentInput}
        value={selectedNote.content}
        onChangeText={handleContentChange}
        placeholder="Start writing..."
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: globalStyles.padding.horizontal,
    paddingVertical: globalStyles.padding.vertical,
  },
  titleInput: {
    width: '100%',
    maxWidth: 800,
    fontSize: globalStyles.fontSize.title,
    color: globalStyles.colors.text,
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
  },
  contentInput: {
    flex: 1,
    color: globalStyles.colors.text,
    fontSize: globalStyles.fontSize.default,
    textAlignVertical: 'top',
    padding: 10,
  },
});

export default Editor; 