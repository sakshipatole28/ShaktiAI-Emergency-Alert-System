import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { alertService, EmergencyAlert } from '../services/AlertService';
import { authService, User } from '../services/AuthService';

export default function VolunteerDashboard() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
    loadUserData();

    // Subscribe to incoming alerts
    const unsubscribeAlerts = alertService.subscribeToAlerts((alert) => {
      setAlerts(prev => [alert, ...prev.filter(a => a.id !== alert.id)]);
      
      // Show notification
      Alert.alert(
        'Emergency Alert!',
        `${alert.type.toUpperCase()}: ${alert.message}`,
        [
          { text: 'Dismiss', style: 'cancel' },
          { text: 'Respond', onPress: () => acknowledgeAlert(alert.id) }
        ]
      );
    });

    return () => {
      unsubscribeAlerts();
    };
  }, []);

  const loadUserData = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  const loadData = async () => {
    const storedAlerts = await alertService.getStoredAlerts();
    setAlerts(storedAlerts);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const volunteerName = currentUser?.name || 'Volunteer';
      const volunteerPhone = currentUser?.phone || '';
      await alertService.acknowledgeAlert(alertId, volunteerName, volunteerPhone);
      await loadData();
      Alert.alert('Response Sent', 'The pilgrim has been notified that help is on the way');
    } catch (error) {
      Alert.alert('Error', 'Failed to send response');
    }
  };

  const openLocation = (alert: EmergencyAlert) => {
    if (alert.location) {
      const { latitude, longitude } = alert.location;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const callPilgrim = (phone: string) => {
    if (phone && phone !== 'Unknown') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('No Phone', 'Phone number not available');
    }
  };

  const handleLogout = async () => {
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
              // Logout using AuthService
              await authService.logout();
              
              // Navigate to role selection
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

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Volunteer Dashboard</Text>
          <Text style={styles.subHeader}>Hello, {currentUser?.name || 'Volunteer'}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Active Alerts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 Active Alerts ({activeAlerts.length})</Text>
        {activeAlerts.length === 0 ? (
          <Text style={styles.emptyText}>No active alerts - All good! 👍</Text>
        ) : (
          activeAlerts.map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.pilgrimInfo}>
                👤 {alert.pilgrimName} • 📱 {alert.pilgrimPhone}
              </Text>
              
              {alert.location && (
                <Text style={styles.locationInfo}>
                  📍 {alert.location.address || 'Location available'}
                </Text>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.respondButton} 
                  onPress={() => acknowledgeAlert(alert.id)}
                >
                  <Text style={styles.buttonText}>🚑 I'll Respond</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.callButton} 
                  onPress={() => callPilgrim(alert.pilgrimPhone)}
                >
                  <Text style={styles.buttonText}>📞 Call</Text>
                </TouchableOpacity>
                
                {alert.location && (
                  <TouchableOpacity 
                    style={styles.locationButton} 
                    onPress={() => openLocation(alert)}
                  >
                    <Text style={styles.buttonText}>🗺️ Map</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Acknowledged Alerts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ My Responses ({acknowledgedAlerts.length})</Text>
        {acknowledgedAlerts.length === 0 ? (
          <Text style={styles.emptyText}>No acknowledged alerts</Text>
        ) : (
          acknowledgedAlerts.map(alert => (
            <View key={alert.id} style={styles.acknowledgedItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
                <Text style={styles.alertTime}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.pilgrimInfo}>
                👤 {alert.pilgrimName} • 📱 {alert.pilgrimPhone}
              </Text>
              
              <Text style={styles.acknowledgedBy}>
                ✅ Acknowledged by you
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Recent Resolved */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✅ Recently Resolved ({resolvedAlerts.slice(0, 3).length})</Text>
        {resolvedAlerts.slice(0, 3).map(alert => (
          <View key={alert.id} style={styles.resolvedItem}>
            <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.resolvedStatus}>✅ Resolved</Text>
          </View>
        ))}
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
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E1F5FE',
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
  resolvedItem: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 8,
    marginTop: 8,
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
  alertMessage: {
    color: '#333',
    marginBottom: 8,
    fontSize: 15,
  },
  pilgrimInfo: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  locationInfo: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  respondButton: {
    backgroundColor: '#4ECDC4',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#FF6B35',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#45B7D1',
    padding: 10,
    borderRadius: 8,
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
  resolvedStatus: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E1F5FE',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
