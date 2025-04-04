import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const [eventName, setEventName] = useState<string>('EVENT NAME');
  const revenue = 45678.90;
  const sales = 2405;
  const averageTicketPrice = sales > 0 ? revenue / sales : 0;
  const netProfit = revenue * 0.65;
  const profitMargin = ((netProfit / revenue) * 100).toFixed(1);

  // Fetch event name from AsyncStorage
  const loadEventName = async () => {
    try {
      const storedEventName = await AsyncStorage.getItem('eventName');
      if (storedEventName) {
        setEventName(storedEventName);
      }
    } catch (error) {
      console.error("Error loading event name:", error);
    }
  };

  // Load event name when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadEventName();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>Chillr</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Ionicons name="person-circle" size={28} color="#2D3748" />
          <Text style={styles.profileName}>Admin</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{eventName}</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  appName: { fontSize: 26, fontWeight: '700', color: '#2D3748' },
  profileContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  profileName: { marginLeft: 8, fontSize: 14, color: '#4A5568', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#2D3748' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#EDF2F7' },
  highlightCard: { borderColor: '#E2E8F0', borderWidth: 1.5, backgroundColor: '#F8FAFC' },
  cardTitle: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#718096' },
  cardValue: { fontSize: 24, fontWeight: '600', color: '#1A202C', marginBottom: 4 },
  highlightValue: { fontSize: 26, fontWeight: '700', color: '#2D3748', marginBottom: 4 },
  positivePercentage: { fontSize: 14, color: '#38A169', fontWeight: '500' },
  negativePercentage: { fontSize: 14, color: '#E53E3E', fontWeight: '500' },
  percentageContainer: { flexDirection: 'row', alignItems: 'center' },
  profitMarginContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  percentageSubtext: { fontSize: 12, color: '#A0AEC0', fontWeight: '400', marginLeft: 6 },
  averagePrice: { fontSize: 12, color: '#718096', fontStyle: 'italic', marginTop: 4 },
  graphContainer: { marginTop: 8, marginBottom: 16 }
});