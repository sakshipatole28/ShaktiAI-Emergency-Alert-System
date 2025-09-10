import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

interface MockAlert {
  id: string;
  type: string;
  pilgrimName: string;
  message: string;
  time: string;
  status: 'active' | 'acknowledged';
}

export default function SimpleVolunteerDashboard() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [volunteerName, setVolunteerName] = useState('');
  const [mockAlerts, setMockAlerts] = useState<MockAlert[]>([
    {
      id: '1',
      type: 'SOS',
      pilgrimName: 'Demo Pilgrim',
      message: 'Emergency SOS button pressed - immediate assistance needed!',
      time: new Date().toLocaleTimeString(),
      status: 'active'
    },
    {
      id: '2',
      type: 'Gesture',
      pilgrimName: 'Test User',
      message: 'AI detected help gesture - assistance required!',
      time: new Date(Date.now() - 300000).toLocaleTimeString(),
      status: 'active'
    }
  ]);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      setVolunteerName(name || 'Volunteer');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setMockAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged' as const }
          : alert
      )
    );
    setResponseCount(prev => prev + 1);
    Alert.alert('Response Sent!', 'The pilgrim has been notified that help is on the way.');
  };

  const addDemoAlert = () => {
    const newAlert: MockAlert = {
      id: Date.now().toString(),
      type: 'Voice',
      pilgrimName: 'New Pilgrim',
      message: 'AI detected distress call - emergency assistance needed!',
      time: new Date().toLocaleTimeString(),
      status: 'active'
    };
    setMockAlerts(prev => [newAlert, ...prev]);
    Alert.alert('New Alert!', 'Emergency alert received from pilgrim.');
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

  const activeAlerts = mockAlerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = mockAlerts.filter(alert => alert.status === 'acknowledged');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Volunteer Dashboard</Text>
          <Text style={styles.welcomeText}>Hello, {volunteerName}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{activeAlerts.length}</Text>
          <Text style={styles.statLabel}>Active Alerts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{responseCount}</Text>
          <Text style={styles.statLabel}>My Responses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{acknowledgedAlerts.length}</Text>
          <Text style={styles.statLabel}>Acknowledged</Text>
        </View>
      </View>

      <View style={styles.demoSection}>
        <TouchableOpacity style={styles.demoButton} onPress={addDemoAlert}>
          <Text style={styles.demoButtonText}>🚨 Simulate New Alert</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 Active Alerts ({activeAlerts.length})</Text>
        {activeAlerts.length === 0 ? (
          <Text style={styles.emptyText}>No active alerts - All good! 👍</Text>
        ) : (
          activeAlerts.map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              
              <Text style={styles.pilgrimName}>👤 {alert.pilgrimName}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.locationInfo}>📍 Demo Location, Chandigarh</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.respondButton} 
                  onPress={() => acknowledgeAlert(alert.id)}
                >
                  <Text style={styles.buttonText}>🚑 I'll Respond</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.callButton}>
                  <Text style={styles.buttonText}>📞 Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.locationButton}>
                  <Text style={styles.buttonText}>🗺️ Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ My Responses ({acknowledgedAlerts.length})</Text>
        {acknowledgedAlerts.length === 0 ? (
          <Text style={styles.emptyText}>No acknowledged alerts yet</Text>
        ) : (
          acknowledgedAlerts.map(alert => (
            <View key={alert.id} style={styles.acknowledgedItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              
              <Text style={styles.pilgrimName}>👤 {alert.pilgrimName}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.acknowledgedBy}>✅ Acknowledged by you</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Volunteer Info</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoItem}>🚑 <Text style={styles.infoText}>Status: Available for emergencies</Text></Text>
          <Text style={styles.infoItem}>📡 <Text style={styles.infoText}>Network: Connected to ShaktiAI</Text></Text>
          <Text style={styles.infoItem}>📍 <Text style={styles.infoText}>Coverage: 2km radius</Text></Text>
          <Text style={styles.infoItem}>⚡ <Text style={styles.infoText}>Response Time: ~5 minutes</Text></Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Thank you for being a volunteer! Your help makes our community safer.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
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
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  demoSection: {
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
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
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  alertItem: {
    borderWidth: 2,
    borderColor: '#FFE1D6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF9F7',
  },
  acknowledgedItem: {
    borderWidth: 2,
    borderColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FFF9',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontWeight: 'bold',
    color: '#FF6B35',
    fontSize: 16,
  },
  alertTime: {
    color: '#888',
    fontSize: 12,
  },
  pilgrimName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  alertMessage: {
    color: '#333',
    marginBottom: 8,
    fontSize: 15,
  },
  locationInfo: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  respondButton: {
    backgroundColor: '#4ECDC4',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#FF6B35',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#45B7D1',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  acknowledgedBy: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
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
  footer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
