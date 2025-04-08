import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { globalStyles } from '../config/styles';

const Editor = ({ selectedNote, setSelectedNote }) => {
  const handleTitleChange = (text) => {
    setSelectedNote(prev => ({ ...prev, title: text }));
  };

  const handleContentChange = (text) => {
    setSelectedNote(prev => ({ ...prev, content: text }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          value={selectedNote.title}
          onChangeText={handleTitleChange}
          placeholder="Title"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>
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
    paddingBottom: globalStyles.padding.bottom,
  },
  titleContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: globalStyles.padding.horizontal,
    alignItems: 'center',
  },
  titleInput: {
    width: '100%',
    maxWidth: 800,
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
  },
  contentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    textAlignVertical: 'top',
    padding: 10,
    marginTop: 120,
  },
});

export default Editor; 