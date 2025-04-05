import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewEventScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [eventData, setEventData] = useState({
    eventName: '',
    venue: '',
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!eventData.eventName.trim()) errors.push('Event Name');
    if (!eventData.venue.trim()) errors.push('Venue');
    
    if (errors.length > 0) {
      Alert.alert('Missing Information', `Please fill in: ${errors.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const payload = {
        name: eventData.eventName,
        venue: eventData.venue,
        date: date.toISOString(),
        description: eventData.description,
        target: parseFloat(eventData.target) || 0,
        vipTickets: {
          price: parseFloat(eventData.priceVIP) || 0,
          quantity: parseInt(eventData.vipTickets) || 0
        },
        generalTickets: {
          price: parseFloat(eventData.priceGeneral) || 0,
          quantity: parseInt(eventData.generalTickets) || 0
        },
        earlyBirdTickets: {
          price: parseFloat(eventData.priceEarlyBird) || 0,
          quantity: parseInt(eventData.earlyBirdTickets) || 0
        }
      };

      const response = await fetch('http://your-api-url/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Event creation failed');
      }

      setModalVisible(true);
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
      console.error("Event creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setEventData({
      eventName: '',
      venue: '',
      description: '',
      target: '',
      vipTickets: '',
      generalTickets: '',
      earlyBirdTickets: '',
      priceVIP: '',
      priceGeneral: '',
      priceEarlyBird: '',
    });
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
        <Text style={styles.header}>New Event</Text>

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

          <Text style={styles.sectionLabel}>Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

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

        <View style={styles.divider} />

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Event</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

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
                resetForm();
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
    paddingBottom: 20,
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
  disabledButton: {
    backgroundColor: '#BEE3F8',
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