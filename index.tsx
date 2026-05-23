import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { supabase } from './api/supabase';

// Temporary mock data so you can see the layout while the database is empty
const MOCK_DATA = [
  { id: '1', caller_number: '+1 (555) 123-4567', duration_seconds: 120, created_at: new Date().toISOString() },
  { id: '2', caller_number: '+1 (555) 987-6543', duration_seconds: 45, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', caller_number: '+1 (555) 555-5555', duration_seconds: 0, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', caller_number: 'Unknown Caller', duration_seconds: 0, created_at: new Date(Date.now() - 259200000).toISOString() },
];

export default function HomeScreen() {
  // Setting the state to use our fake data for now
  const [calls, setCalls] = useState(MOCK_DATA);

  // Helper function to turn "120 seconds" into "2m 0s"
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Missed Call';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Helper function to format the timestamp into a readable date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' • ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // The design for a single row (card) in our feed
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.callerNumber}>📞 {item.caller_number}</Text>
        <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.duration, item.duration_seconds === 0 ? styles.missedCall : styles.answeredCall]}>
          {item.duration_seconds === 0 ? '❌ ' : '⏱️ '}
          {formatDuration(item.duration_seconds)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Feed</Text>
      </View>

      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No recent calls.</Text>}
      />
    </SafeAreaView>
  );
}

// Visual layout styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light grayish-blue background
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B', // Dark slate color
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Adds a subtle shadow on Android
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  callerNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
  },
  missedCall: {
    color: '#EF4444', // Red text for missed calls
  },
  answeredCall: {
    color: '#10B981', // Green text for answered calls
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#64748B',
  },
});