import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

export default function SimplePilgrimDashboard() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [demoAlerts, setDemoAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'Pilgrim');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const triggerSOS = () => {
    const newAlert = `SOS Alert #${alertCount + 1} - ${new Date().toLocaleTimeString()}`;
    setDemoAlerts(prev => [newAlert, ...prev]);
    setAlertCount(prev => prev + 1);
    Alert.alert('SOS Alert Sent!', 'Your emergency alert has been broadcasted to nearby volunteers.');
  };

  const triggerDemoGesture = () => {
    const newAlert = `Gesture Alert #${alertCount + 1} - ${new Date().toLocaleTimeString()}`;
    setDemoAlerts(prev => [newAlert, ...prev]);
    setAlertCount(prev => prev + 1);
    Alert.alert('Gesture Detected!', 'AI detected help gesture - Alert sent to volunteers.');
  };

  const triggerDemoVoice = () => {
    const newAlert = `Voice Alert #${alertCount + 1} - ${new Date().toLocaleTimeString()}`;
    setDemoAlerts(prev => [newAlert, ...prev]);
    setAlertCount(prev => prev + 1);
    Alert.alert('Voice Detected!', 'AI detected distress call - Alert sent to volunteers.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userRole', 'userName', 'userPhone']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'RoleSelection' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Pilgrim Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Actions</Text>
        
        <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
          <Text style={styles.sosText}>🆘 SOS</Text>
          <Text style={styles.sosSubText}>Emergency Alert</Text>
        </TouchableOpacity>

        <View style={styles.aiSection}>
          <Text style={styles.aiTitle}>🤖 AI Detection Demo</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={triggerDemoGesture}>
              <Text style={styles.actionEmoji}>👋</Text>
              <Text style={styles.actionText}>Demo Gesture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionSecondary]} onPress={triggerDemoVoice}>
              <Text style={styles.actionEmoji}>📢</Text>
              <Text style={styles.actionText}>Demo Voice</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.statusText}>🟢 AI Systems Active</Text>
          <Text style={styles.statusSubText}>Gesture & Voice Detection Running</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Alerts ({demoAlerts.length})</Text>
        {demoAlerts.length === 0 ? (
          <Text style={styles.emptyText}>No alerts sent yet. Try the demo buttons above!</Text>
        ) : (
          demoAlerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <Text style={styles.alertText}>{alert}</Text>
              <Text style={styles.alertStatus}>Status: Broadcasted ✅</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 How it Works</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoItem}>🆘 <Text style={styles.infoText}>SOS Button: Instant emergency alert</Text></Text>
          <Text style={styles.infoItem}>👋 <Text style={styles.infoText}>Gesture AI: Detects help signals</Text></Text>
          <Text style={styles.infoItem}>📢 <Text style={styles.infoText}>Voice AI: Recognizes distress calls</Text></Text>
          <Text style={styles.infoItem}>📡 <Text style={styles.infoText}>Offline Ready: Works without internet</Text></Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sosSubText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  aiSection: {
    marginBottom: 20,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionSecondary: {
    backgroundColor: '#4ECDC4',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusSection: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  alertItem: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
    marginTop: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  alertStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  infoSection: {
    gap: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    color: '#333',
  },
});
