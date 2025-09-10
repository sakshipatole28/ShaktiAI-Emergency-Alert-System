import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { alertService, EmergencyAlert, VolunteerResponse } from '../services/AlertService';
import { aiDetectionService } from '../services/AIDetectionService';
import { authService, User } from '../services/AuthService';

export default function PilgrimDashboard() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [responses, setResponses] = useState<VolunteerResponse[]>([]);
  const [status, setStatus] = useState({ gestureActive: false, voiceActive: false });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load alerts and responses
    loadData();
    loadUserData();

    // Subscribe to responses from volunteers
    const unsubscribeResponse = alertService.subscribeToResponses((response) => {
      setResponses(prev => [response, ...prev]);
      Alert.alert('Volunteer Responded', `${response.volunteerName} is on the way`);
    });

    // Load models and start AI detection

    (async () => {
      await aiDetectionService.loadModels();
      await aiDetectionService.startGestureDetection((result) => {
        console.log('Gesture detection result:', result);
      });
      setStatus(aiDetectionService.getStatus());
    })();

    return () => {
      unsubscribeResponse();
      aiDetectionService.stopAllDetection();
    };
  }, []);

  const loadUserData = async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  const loadData = async () => {
    const storedAlerts = await alertService.getStoredAlerts();
    const storedResponses = await alertService.getVolunteerResponses();
    setAlerts(storedAlerts);
    setResponses(storedResponses);
  };

  const triggerSOS = async () => {
    try {
      const id = await alertService.broadcastAlert('sos', 'SOS pressed by pilgrim');
      await loadData();
      Alert.alert('Alert Sent', 'SOS alert broadcasted to nearby volunteers');
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert');
    }
  };

  const triggerDemoGesture = async () => {
    await aiDetectionService.triggerDemoGestureAlert();
    await loadData();
  };

  const triggerDemoVoice = async () => {
    await aiDetectionService.triggerDemoVoiceAlert();
    await loadData();
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
              // Stop AI detection
              await aiDetectionService.stopAllDetection();
              
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Pilgrim Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome, {currentUser?.name || 'Pilgrim'}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={triggerDemoGesture}>
            <Text style={styles.actionText}>Demo Gesture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionSecondary]} onPress={triggerDemoVoice}>
            <Text style={styles.actionText}>Demo Voice</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.statusText}>
          Gesture AI: {status.gestureActive ? 'Active' : 'Inactive'} | Voice AI: {status.voiceActive ? 'Inactive' : 'Inactive'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Alerts</Text>
        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>No alerts yet</Text>
        ) : (
          alerts.map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertMeta}>
                {new Date(alert.timestamp).toLocaleString()} • {alert.location?.address || 'No address'}
              </Text>
              <Text style={styles.alertStatus}>Status: {alert.status}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Volunteer Responses</Text>
        {responses.length === 0 ? (
          <Text style={styles.emptyText}>No responses yet</Text>
        ) : (
          responses.map((resp, idx) => (
            <View key={`${resp.alertId}_${idx}`} style={styles.responseItem}>
              <Text style={styles.responseTitle}>{resp.volunteerName}</Text>
              <Text style={styles.responseMessage}>{resp.message}</Text>
              <Text style={styles.responseMeta}>{new Date(resp.timestamp).toLocaleString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
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
  welcomeText: {
    fontSize: 16,
    color: '#666',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE1D6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
    shadowColor: '#FF3B30',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  actionSecondary: {
    backgroundColor: '#4ECDC4',
    marginRight: 0,
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  alertItem: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 8,
    marginTop: 8,
  },
  alertType: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  alertMessage: {
    color: '#333',
  },
  alertMeta: {
    color: '#888',
    fontSize: 12,
  },
  alertStatus: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
  responseItem: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 8,
    marginTop: 8,
  },
  responseTitle: {
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  responseMessage: {
    color: '#333',
  },
  responseMeta: {
    color: '#888',
    fontSize: 12,
  },
});
