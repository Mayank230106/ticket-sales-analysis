import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal,
  KeyboardAvoidingView, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewEventScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
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

  const handleSubmit = async () => {
    if (!eventData.eventName.trim()) {
      alert("Event name cannot be empty!");
      return;
    }

    try {
      const eventDetails = {
        name: eventData.eventName,
        venue: eventData.venue,
        date: eventData.date,
        description: eventData.description,
        breakEvenPoint: eventData.target ? parseFloat(eventData.target) : 0,
        vipTickets: eventData.vipTickets ? parseInt(eventData.vipTickets) : 0,
        generalTickets: eventData.generalTickets ? parseInt(eventData.generalTickets) : 0,
        earlyBirdTickets: eventData.earlyBirdTickets ? parseInt(eventData.earlyBirdTickets) : 0,
        vipTicketPrice: eventData.priceVIP ? parseFloat(eventData.priceVIP) : 0,
        generalTicketPrice: eventData.priceGeneral ? parseFloat(eventData.priceGeneral) : 0,
        earlyBirdTicketPrice: eventData.priceEarlyBird ? parseFloat(eventData.priceEarlyBird) : 0,
      };

      await AsyncStorage.setItem('eventName', eventData.eventName);
      await AsyncStorage.setItem('eventDetails', JSON.stringify(eventDetails));
      setModalVisible(true);
    } catch (error) {
      console.error("Error saving event data:", error);
      alert("Failed to save event data. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {/* Header */}
        <Text style={styles.header}>New Event</Text>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Event Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            onChangeText={(text) => handleChange('eventName', text)}
            value={eventData.eventName}
          />

          <Text style={styles.sectionLabel}>Venue</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter venue"
            onChangeText={(text) => handleChange('venue', text)}
            value={eventData.venue}
          />

          <Text style={styles.sectionLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter date"
            onChangeText={(text) => handleChange('date', text)}
            value={eventData.date}
          />

          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.description]}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            onChangeText={(text) => handleChange('description', text)}
            value={eventData.description}
          />
        </View>

        {/* Financial Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Target (Break-even Point)</Text>
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                handleChange('target', numericValue);
              }}
              value={eventData.target}
            />
          </View>

          <Text style={styles.sectionLabel}>No. of VIP Tickets</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              handleChange('vipTickets', numericValue);
            }}
            value={eventData.vipTickets}
          />

          <Text style={styles.sectionLabel}>No. of General Tickets</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              handleChange('generalTickets', numericValue);
            }}
            value={eventData.generalTickets}
          />

          <Text style={styles.sectionLabel}>No. of Early Bird Tickets</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              handleChange('earlyBirdTickets', numericValue);
            }}
            value={eventData.earlyBirdTickets}
          />

          <Text style={styles.sectionLabel}>Price of VIP Ticket</Text>
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                handleChange('priceVIP', numericValue);
              }}
              value={eventData.priceVIP}
            />
          </View>

          <Text style={styles.sectionLabel}>Price of General Ticket</Text>
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                handleChange('priceGeneral', numericValue);
              }}
              value={eventData.priceGeneral}
            />
          </View>

          <Text style={styles.sectionLabel}>Price of Early Bird Ticket</Text>
          <View style={styles.currencyInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                handleChange('priceEarlyBird', numericValue);
              }}
              value={eventData.priceEarlyBird}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

        {/* Extra padding to ensure button is always visible */}
        <View style={{ height: 50 }} />
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
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setModalVisible(false);
                setEventData({
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
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20, // Reduced to allow button to be visible
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 16,
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 16,
    color: '#4A5568',
  },
  currencyInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
    backgroundColor: '#4299E1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});