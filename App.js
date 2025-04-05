import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
      title: 'Untitled Note',
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
      // Prompt for title
      Alert.prompt(
        'Save Note',
        'Enter a title for your note:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => console.log('Cancel Pressed')
          },
          {
            text: 'Save',
            onPress: (title) => {
              if (title && title.trim()) {
                const updatedNotes = notes.map(note => 
                  note.id === selectedNote.id 
                    ? { ...note, title: title.trim(), content: selectedNote.content }
                    : note
                );
                setNotes(updatedNotes);
                setSelectedNote(null);
                setMenuVisible(false);
              } else {
                Alert.alert('Error', 'Please enter a valid title');
              }
            }
          }
        ],
        'plain-text',
        selectedNote.title === 'Untitled Note' ? '' : selectedNote.title
      );
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

  const exportNote = async () => {
    if (selectedNote) {
      try {
        const fileName = `${selectedNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        
        // Create the file content
        const fileContent = `${selectedNote.title}\n\n${selectedNote.content}`;
        
        // Write the file
        await FileSystem.writeAsStringAsync(filePath, fileContent);
        
        // Share the file
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Note',
          UTI: 'public.plain-text'
        });
        
        setMenuVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to export note');
        console.error('Export error:', error);
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {!menuVisible && (
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
      )}
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
            exportNote={exportNote}
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
    marginTop: 10,
  },
});
