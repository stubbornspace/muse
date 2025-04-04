import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

const NoteList = ({ notes, setSelectedNote }) => {
  const renderNoteItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => setSelectedNote(item)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.homeContainer}>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        style={styles.notesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  notesList: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
  noteItem: {
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
});

export default NoteList; 