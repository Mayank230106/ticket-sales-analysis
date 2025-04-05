import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, Pressable, TextInput, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from "@clerk/clerk-expo";
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { SignOutButton } from '@/app/tabs/SignOutButton';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [eventName, setEventName] = useState<string>('EVENT NAME');
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [adminName, setAdminName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data for dashboard
  const revenue = 45678.90;
  const sales = 2405;
  const averageTicketPrice = sales > 0 ? revenue / sales : 0;
  const netProfit = revenue * 0.65;
  const profitMargin = ((netProfit / revenue) * 100).toFixed(1);

  // Google OAuth
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPressGoogleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  // Load data from storage
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [storedEventName, storedEventDetails, storedAdminName] = await Promise.all([
        AsyncStorage.getItem('eventName'),
        AsyncStorage.getItem('eventDetails'),
        AsyncStorage.getItem('adminName')
      ]);
      
      if (storedEventName) setEventName(storedEventName);
      if (storedEventDetails) setEventDetails(JSON.parse(storedEventDetails));
      if (storedAdminName) setAdminName(storedAdminName);
      
      if (user && !storedAdminName) {
        setShowNameModal(true);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save admin name
  const saveAdminName = async () => {
    if (!adminName.trim()) return;
    
    try {
      await AsyncStorage.setItem('adminName', adminName.trim());
      setShowNameModal(false);
    } catch (error) {
      console.error("Error saving admin name:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isLoaded) {
        loadData();
      }
    }, [isLoaded, user])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>Chillr</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Ionicons name="person-circle" size={28} color="#2D3748" />
          <Text style={styles.profileName}>
            {adminName || user?.firstName || 'Admin'}
          </Text>
        </TouchableOpacity>
      </View>

      <SignedIn>
        {/* Name Setup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showNameModal}
          onRequestClose={() => setShowNameModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Your Display Name</Text>
                <Pressable onPress={() => setShowNameModal(false)}>
                  <Ionicons name="close" size={24} color="#4A5568" />
                </Pressable>
              </View>
              
              <Text style={styles.modalSubtitle}>This name will be displayed in the app</Text>
              
              <TextInput
                style={styles.nameInput}
                placeholder="Enter your name"
                value={adminName}
                onChangeText={setAdminName}
                autoFocus={true}
                maxLength={30}
              />
              
              <TouchableOpacity 
                style={[styles.saveButton, !adminName.trim() && styles.saveButtonDisabled]}
                onPress={saveAdminName}
                disabled={!adminName.trim()}
              >
                <Text style={styles.saveButtonText}>Save Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Dashboard Content */}
        <TouchableOpacity 
          style={styles.eventNameContainer}
          onPress={() => setShowEventModal(true)}
        >
          <Text style={styles.eventNameText}>{eventName}</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>REVENUE</Text>
          <Text style={styles.cardValue}>${revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</Text>
          <Text style={styles.positivePercentage}>+20% month over month</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>SALES</Text>
          <Text style={styles.cardValue}>{sales.toLocaleString()}</Text>
          <View style={styles.percentageContainer}>
            <Text style={styles.positivePercentage}>+33% </Text>
            <Text style={styles.percentageSubtext}>month over month</Text>
          </View>
          <Text style={styles.averagePrice}>Avg. ${averageTicketPrice.toFixed(2)}/ticket</Text>
        </View>

        <View style={[styles.card, styles.highlightCard]}>
          <Text style={styles.cardTitle}>NET PROFIT</Text>
          <Text style={styles.highlightValue}>${netProfit.toLocaleString('en-US', {minimumFractionDigits: 2})}</Text>
          <View style={styles.profitMarginContainer}>
            <Text style={netProfit >= 0 ? styles.positivePercentage : styles.negativePercentage}>
              {profitMargin}% margin
            </Text>
            <Text style={styles.percentageSubtext}>(After all expenses)</Text>
          </View>
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>DEMAND TRENDS</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                data: [45, 60, 35, 80, 65, 90],
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                strokeWidth: 2
              }]
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#4CAF50' }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        {/* Event Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showEventModal}
          onRequestClose={() => setShowEventModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Event Details</Text>
                <Pressable onPress={() => setShowEventModal(false)}>
                  <Ionicons name="close" size={24} color="#4A5568" />
                </Pressable>
              </View>
              
              {eventDetails ? (
                <ScrollView style={styles.modalContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Event Name:</Text>
                    <Text style={styles.detailValue}>{eventDetails.name || 'Not specified'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Venue:</Text>
                    <Text style={styles.detailValue}>{eventDetails.venue || 'Not specified'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{eventDetails.date || 'Not specified'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{eventDetails.description || 'Not specified'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Break-even Point:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.breakEvenPoint ? `$${eventDetails.breakEvenPoint}` : 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>VIP Tickets:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.vipTickets ? `${eventDetails.vipTickets}` : '0'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>General Tickets:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.generalTickets ? `${eventDetails.generalTickets}` : '0'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Early Bird Tickets:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.earlyBirdTickets ? `${eventDetails.earlyBirdTickets}` : '0'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>VIP Ticket Price:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.vipTicketPrice ? `$${eventDetails.vipTicketPrice}` : 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>General Ticket Price:</Text>
                    <Text style={styles.detailValue}>
                      {eventDetails.generalTicketPrice ? `$${eventDetails.generalTicketPrice}` : 'Not specified'}
                    </Text>
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.noDetailsText}>No event details available</Text>
              )}
            </View>
          </View>
        </Modal>
      </SignedIn>
      
      <SignedOut>
        <View style={styles.authScreen}>
          <Image 
            source={require('@/assets/images/adaptive-icon.png')} 
            style={styles.authLogo}
          />
          <Text style={styles.authTitle}>Welcome to Chillr</Text>
          <Text style={styles.authSubtitle}>Event Management Dashboard</Text>
          
          <View style={styles.authButtonsContainer}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Sign in with Email</Text>
              </TouchableOpacity>
            </Link>
            
            <TouchableOpacity 
              style={[styles.authButton, styles.googleButton]}
              onPress={onPressGoogleSignIn}
            >
              <Image 
                source={require('@/assets/images/favicon.png')}
                style={styles.googleIcon}
              />
              <Text style={[styles.authButtonText, styles.googleButtonText]}>
                Continue with Google
              </Text>
            </TouchableOpacity>
            
            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.signUpLink}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </SignedOut>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 40 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24, 
    paddingTop: 8 
  },
  appName: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#2D3748' 
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F7FAFC', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  profileName: { 
    marginLeft: 8, 
    fontSize: 14, 
    color: '#4A5568', 
    fontWeight: '500' 
  },
  eventNameContainer: {
    backgroundColor: '#4299E1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#EDF2F7' 
  },
  highlightCard: { 
    borderColor: '#E2E8F0', 
    borderWidth: 1.5, 
    backgroundColor: '#F8FAFC' 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: '500', 
    marginBottom: 6, 
    color: '#718096' 
  },
  cardValue: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#1A202C', 
    marginBottom: 4 
  },
  highlightValue: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#2D3748', 
    marginBottom: 4 
  },
  positivePercentage: { 
    fontSize: 14, 
    color: '#38A169', 
    fontWeight: '500' 
  },
  negativePercentage: { 
    fontSize: 14, 
    color: '#E53E3E', 
    fontWeight: '500' 
  },
  percentageContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  profitMarginContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4 
  },
  percentageSubtext: { 
    fontSize: 12, 
    color: '#A0AEC0', 
    fontWeight: '400', 
    marginLeft: 6 
  },
  averagePrice: { 
    fontSize: 12, 
    color: '#718096', 
    fontStyle: 'italic', 
    marginTop: 4 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2D3748',
  },
  graphContainer: { 
    marginTop: 8, 
    marginBottom: 16 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  modalSubtitle: {
    color: '#718096',
    fontSize: 14,
    marginTop: 8,
  },
  modalContent: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  detailLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  noDetailsText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginVertical: 20,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  authScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  authLogo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 40,
  },
  authButtonsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  authButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: '#2D3748',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#718096',
    marginRight: 5,
  },
  signUpLink: {
    color: '#4299E1',
    fontWeight: '600',
  },
});