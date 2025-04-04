import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from './ErrorBoundary';
import Editor from './components/Editor';
import NoteList from './components/NoteList';
import Menu from './components/Menu';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Auto-loads notes on app start
  useEffect(() => {
    loadNotesFromStorage();
  }, []);

  // Auto-saves notes when they change
  useEffect(() => {
    saveNotesToStorage();
  }, [notes]);

  const addNote = async () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      category: 'default',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setMenuVisible(false);
  };

  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, content: selectedNote.content }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote(null);
      setMenuVisible(false);
    }
  };

  const deleteNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.filter(note => note.id !== selectedNote.id);
      setNotes(updatedNotes);
      setSelectedNote(null);
      setMenuVisible(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteNote }
      ]
    );
  };

  const saveNotesToStorage = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const loadNotesFromStorage = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ErrorBoundary>
      <ImageBackground 
        source={require('./assets/space.jpg')} 
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {renderHeader()}
          <Menu 
            menuVisible={menuVisible}
            setMenuVisible={setMenuVisible}
            selectedNote={selectedNote}
            addNote={addNote}
            saveNote={saveNote}
            confirmDelete={confirmDelete}
            setSelectedNote={setSelectedNote}
          />
          <View style={styles.overlay}>
            {selectedNote ? (
              <Editor 
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                notes={notes}
                setNotes={setNotes}
              />
            ) : (
              <NoteList 
                notes={notes}
                setSelectedNote={setSelectedNote}
              />
            )}
            <StatusBar style="light" />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuButton: {
    padding: 5,
  },
});
