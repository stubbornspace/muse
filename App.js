import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, SafeAreaView, Alert, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';
import ErrorBoundary from './components/ErrorBoundary';
import Editor from './components/Editor';
import NoteList from './components/NoteList';
import Menu from './components/Menu';
import BackButton from './components/BackButton';
import ChatBot from './components/ChatBot';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const menuTimeoutRef = useRef(null);

  // Configure audio settings and load audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configure audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        
        // Load the audio file
        const { sound: audioSound } = await Audio.Sound.createAsync(
          require('./audio/homeworld.m4a'),
          { shouldPlay: false, isLooping: true }
        );
        setSound(audioSound);
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };
    
    setupAudio();
    
    // Cleanup function to unload audio when app closes
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Auto-loads notes on app start
  useEffect(() => {
    loadNotesFromStorage();
  }, []);

  // Auto-saves notes when they change
  useEffect(() => {
    saveNotesToStorage();
  }, [notes]);

  // Handle menu visibility timeout
  useEffect(() => {
    if (isMenuVisible) {
      // Clear any existing timeout
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
      
      // Set a new timeout to hide the menu after 3 seconds of inactivity
      menuTimeoutRef.current = setTimeout(() => {
        setIsMenuVisible(false);
      }, 3000);
    }
    
    // Cleanup timeout on unmount or when menu visibility changes
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, [isMenuVisible]);

  const togglePlayback = async () => {
    if (!sound) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

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
  };

  const saveNote = () => {
    if (selectedNote) {
      if (selectedNote.title && selectedNote.title.trim()) {
        const updatedNotes = notes.map(note => 
          note.id === selectedNote.id 
            ? { ...note, title: selectedNote.title.trim(), content: selectedNote.content }
            : note
        );
        setNotes(updatedNotes);
        setSelectedNote(null);
      } else {
        Alert.alert('Error', 'Please enter a valid title');
      }
    }
  };

  const deleteNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.filter(note => note.id !== selectedNote.id);
      setNotes(updatedNotes);
      setSelectedNote(null);
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
      } catch (error) {
        Alert.alert('Error', 'Failed to export note');
        console.error('Export error:', error);
      }
    }
  };

  const handleScreenTouch = () => {
    setIsMenuVisible(true);
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleCopyToEditor = (content) => {
    if (selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, content: note.content + '\n\n' + content }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote({ ...selectedNote, content: selectedNote.content + '\n\n' + content });
    }
  };

  return (
    <ErrorBoundary>
      <ImageBackground 
        source={require('./assets/space.jpg')} 
        style={styles.container}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={handleScreenTouch}>
            <SafeAreaView style={styles.safeArea}>
              {selectedNote && (
                <BackButton 
                  setSelectedNote={setSelectedNote} 
                  onCloseChat={toggleChat}
                  isChatVisible={false}
                />
              )}
              {isChatVisible && (
                <BackButton 
                  setSelectedNote={setSelectedNote} 
                  onCloseChat={toggleChat}
                  isChatVisible={true}
                />
              )}
              <Menu 
                selectedNote={selectedNote}
                addNote={addNote}
                saveNote={saveNote}
                confirmDelete={confirmDelete}
                setSelectedNote={setSelectedNote}
                exportNote={exportNote}
                isPlaying={isPlaying}
                togglePlayback={togglePlayback}
                isVisible={isMenuVisible}
                toggleChat={toggleChat}
                isChatVisible={isChatVisible}
              />
              <View style={styles.contentContainer}>
                {isChatVisible ? (
                  <ChatBot 
                    isVisible={true}
                    onClose={toggleChat}
                    onCopyToEditor={handleCopyToEditor}
                  />
                ) : selectedNote ? (
                  <Editor 
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
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
          </TouchableWithoutFeedback>
        </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  }
});
