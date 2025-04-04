import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewEventScreen() {
  const [eventData, setEventData] = useState({
    eventName: '',
    venue: '',
    date: '',
    description: '',
    target: '',
    vipTickets: '',
    generalTickets: '',
    earlyBirdTickets: '',
    priceVIP: '',
    priceGeneral: '',
    priceEarlyBird: '',
  });

  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (key: string, value: string) => {
    setEventData({ ...eventData, [key]: value });
  };

  // Function to handle event submission
  const handleSubmit = async () => {
    if (!eventData.eventName.trim()) {
      alert("Event name cannot be empty!");
      return;
    }

    try {
      // Save event name to AsyncStorage
      await AsyncStorage.setItem('eventName', eventData.eventName);
      setModalVisible(true);
    } catch (error) {
      console.error("Error saving event name:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>New Event</Text>

      {/* Scrollable Form Section */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {[
          { key: 'eventName', label: 'Event Name' },
          { key: 'venue', label: 'Venue' },
          { key: 'date', label: 'Date (YYYY-MM-DD)' },
        ].map((field) => (
          <TextInput
            key={field.key}
            style={styles.input}
            placeholder={field.label}
            placeholderTextColor="#4A5568"
            onChangeText={(text) => handleChange(field.key, text)}
            value={eventData[field.key as keyof typeof eventData]}

          />
        ))}

        {/* Description - Larger Input Field */}
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Description"
          placeholderTextColor="#4A5568"
          multiline
          numberOfLines={4}
          onChangeText={(text) => handleChange('description', text)}
          value={eventData.description}
        />

        {/* Numeric Input Fields */}
        {[
          { key: 'target', label: 'Target (Break-even Point)' },
          { key: 'vipTickets', label: 'No. of VIP Tickets' },
          { key: 'generalTickets', label: 'No. of General Tickets' },
          { key: 'earlyBirdTickets', label: 'No. of Early Bird Tickets' },
          { key: 'priceVIP', label: 'Price of VIP Ticket' },
          { key: 'priceGeneral', label: 'Price of General Ticket' },
          { key: 'priceEarlyBird', label: 'Price of Early Bird Ticket' },
        ].map((field) => (
          <TextInput
            key={field.key}
            style={styles.input}
            placeholder={field.label}
            placeholderTextColor="#4A5568"
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              handleChange(field.key, numericValue);
            }}
            value={eventData[field.key as keyof typeof eventData]}

          />
        ))}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>✅ Event Created!</Text>
            <Text style={styles.modalMessage}>Your event has been successfully created.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,  // Ensures scrolling works properly
    paddingBottom: 80, // Space for the button
  },
  input: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 10, 
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 10,
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

