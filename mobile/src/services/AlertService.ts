import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EmergencyAlert {
  id: string;
  type: 'sos' | 'gesture' | 'voice' | 'inactivity';
  pilgrimName: string;
  pilgrimPhone: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: number;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
}

export interface VolunteerResponse {
  volunteerName: string;
  volunteerPhone: string;
  alertId: string;
  timestamp: number;
  message: string;
}

class AlertService {
  private alertListeners: ((alert: EmergencyAlert) => void)[] = [];
  private responseListeners: ((response: VolunteerResponse) => void)[] = [];

  // Generate unique ID
  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get current location (simplified for demo)
  private async getCurrentLocation() {
    try {
      // For demo purposes, return mock location
      return {
        latitude: 30.7333,
        longitude: 76.7794,
        address: 'Demo Location, Chandigarh',
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  // Broadcast emergency alert
  async broadcastAlert(type: EmergencyAlert['type'], message: string = ''): Promise<string> {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userPhone = await AsyncStorage.getItem('userPhone');
      const location = await this.getCurrentLocation();

      const alert: EmergencyAlert = {
        id: this.generateId(),
        type,
        pilgrimName: userName || 'Anonymous Pilgrim',
        pilgrimPhone: userPhone || 'Unknown',
        location,
        timestamp: Date.now(),
        message: message || this.getDefaultMessage(type),
        status: 'active',
      };

      // Store alert locally
      await this.storeAlert(alert);

      // Simulate broadcasting to nearby volunteers (in real app, this would use mesh networking)
      setTimeout(() => {
        this.notifyVolunteers(alert);
      }, 100);

      return alert.id;
    } catch (error) {
      console.error('Error broadcasting alert:', error);
      throw new Error('Failed to broadcast alert');
    }
  }

  // Store alert in local storage
  private async storeAlert(alert: EmergencyAlert) {
    try {
      const existingAlerts = await this.getStoredAlerts();
      const updatedAlerts = [alert, ...existingAlerts];
      await AsyncStorage.setItem('emergency_alerts', JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error storing alert:', error);
    }
  }

  // Get stored alerts
  async getStoredAlerts(): Promise<EmergencyAlert[]> {
    try {
      const alertsJson = await AsyncStorage.getItem('emergency_alerts');
      return alertsJson ? JSON.parse(alertsJson) : [];
    } catch (error) {
      console.error('Error getting stored alerts:', error);
      return [];
    }
  }

  // Notify volunteers (simulated)
  private notifyVolunteers(alert: EmergencyAlert) {
    // In a real app, this would use actual mesh networking or server broadcasting
    // For demo purposes, we'll simulate receiving alerts on volunteer devices
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error notifying alert listener:', error);
      }
    });
  }

  // Subscribe to alerts (for volunteers)
  subscribeToAlerts(callback: (alert: EmergencyAlert) => void): () => void {
    this.alertListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.alertListeners.indexOf(callback);
      if (index > -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }

  // Volunteer acknowledges alert
  async acknowledgeAlert(alertId: string, volunteerName: string, volunteerPhone: string): Promise<void> {
    try {
      const alerts = await this.getStoredAlerts();
      const alertIndex = alerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex > -1) {
        alerts[alertIndex].status = 'acknowledged';
        alerts[alertIndex].acknowledgedBy = volunteerName;
        await AsyncStorage.setItem('emergency_alerts', JSON.stringify(alerts));

        // Store volunteer response
        const response: VolunteerResponse = {
          volunteerName,
          volunteerPhone,
          alertId,
          timestamp: Date.now(),
          message: 'Help is on the way',
        };

        await this.storeVolunteerResponse(response);
        this.notifyResponseListeners(response);
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw new Error('Failed to acknowledge alert');
    }
  }

  // Store volunteer response
  private async storeVolunteerResponse(response: VolunteerResponse) {
    try {
      const existingResponses = await this.getVolunteerResponses();
      const updatedResponses = [response, ...existingResponses];
      await AsyncStorage.setItem('volunteer_responses', JSON.stringify(updatedResponses));
    } catch (error) {
      console.error('Error storing volunteer response:', error);
    }
  }

  // Get volunteer responses
  async getVolunteerResponses(): Promise<VolunteerResponse[]> {
    try {
      const responsesJson = await AsyncStorage.getItem('volunteer_responses');
      return responsesJson ? JSON.parse(responsesJson) : [];
    } catch (error) {
      console.error('Error getting volunteer responses:', error);
      return [];
    }
  }

  // Subscribe to volunteer responses (for pilgrims)
  subscribeToResponses(callback: (response: VolunteerResponse) => void): () => void {
    this.responseListeners.push(callback);
    
    return () => {
      const index = this.responseListeners.indexOf(callback);
      if (index > -1) {
        this.responseListeners.splice(index, 1);
      }
    };
  }

  // Notify response listeners
  private notifyResponseListeners(response: VolunteerResponse) {
    this.responseListeners.forEach(listener => {
      try {
        listener(response);
      } catch (error) {
        console.error('Error notifying response listener:', error);
      }
    });
  }

  // Get default message for alert type
  private getDefaultMessage(type: EmergencyAlert['type']): string {
    switch (type) {
      case 'sos':
        return 'Emergency SOS button pressed - immediate assistance needed!';
      case 'gesture':
        return 'Emergency gesture detected - help signal recognized!';
      case 'voice':
        return 'Distress call detected - scream/call for help identified!';
      case 'inactivity':
        return 'No movement detected for extended period - welfare check needed!';
      default:
        return 'Emergency situation detected - assistance required!';
    }
  }

  // Resolve alert
  async resolveAlert(alertId: string): Promise<void> {
    try {
      const alerts = await this.getStoredAlerts();
      const alertIndex = alerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex > -1) {
        alerts[alertIndex].status = 'resolved';
        await AsyncStorage.setItem('emergency_alerts', JSON.stringify(alerts));
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw new Error('Failed to resolve alert');
    }
  }

  // Get active alerts
  async getActiveAlerts(): Promise<EmergencyAlert[]> {
    const alerts = await this.getStoredAlerts();
    return alerts.filter(alert => alert.status === 'active');
  }

  // Clear old alerts (older than 24 hours)
  async clearOldAlerts(): Promise<void> {
    try {
      const alerts = await this.getStoredAlerts();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const recentAlerts = alerts.filter(alert => alert.timestamp > oneDayAgo);
      await AsyncStorage.setItem('emergency_alerts', JSON.stringify(recentAlerts));
    } catch (error) {
      console.error('Error clearing old alerts:', error);
    }
  }
}

// Export singleton instance
export const alertService = new AlertService();
