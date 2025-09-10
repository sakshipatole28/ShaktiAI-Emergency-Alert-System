import React, { useState, useEffect } from 'react';
import './App.css';

interface EmergencyAlert {
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

interface VolunteerResponse {
  volunteerName: string;
  volunteerPhone: string;
  alertId: string;
  timestamp: number;
  message: string;
}

function App() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [responses, setResponses] = useState<VolunteerResponse[]>([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    // Load demo data
    loadDemoData();
    
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      generateRandomAlert();
    }, 10000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDemoData = () => {
    const demoAlerts: EmergencyAlert[] = [
      {
        id: 'alert_demo_1',
        type: 'sos',
        pilgrimName: 'Ramesh Kumar',
        pilgrimPhone: '+91-9876543210',
        location: {
          latitude: 30.7333,
          longitude: 76.7794,
          address: 'Sector 17, Chandigarh'
        },
        timestamp: Date.now() - 300000, // 5 min ago
        message: 'Emergency SOS button pressed - immediate assistance needed!',
        status: 'acknowledged',
        acknowledgedBy: 'Volunteer Priya'
      },
      {
        id: 'alert_demo_2',
        type: 'gesture',
        pilgrimName: 'Anjali Devi',
        pilgrimPhone: '+91-8765432109',
        location: {
          latitude: 30.7194,
          longitude: 76.7646,
          address: 'Railway Station, Chandigarh'
        },
        timestamp: Date.now() - 600000, // 10 min ago
        message: 'Emergency gesture detected - help signal recognized!',
        status: 'resolved'
      },
      {
        id: 'alert_demo_3',
        type: 'voice',
        pilgrimName: 'Manoj Singh',
        pilgrimPhone: '+91-7654321098',
        timestamp: Date.now() - 120000, // 2 min ago
        message: 'Distress call detected - scream/call for help identified!',
        status: 'active'
      }
    ];

    const demoResponses: VolunteerResponse[] = [
      {
        volunteerName: 'Priya Sharma',
        volunteerPhone: '+91-9123456789',
        alertId: 'alert_demo_1',
        timestamp: Date.now() - 240000,
        message: 'Help is on the way'
      }
    ];

    setAlerts(demoAlerts);
    setResponses(demoResponses);
    updateStats(demoAlerts);
  };

  const generateRandomAlert = () => {
    const names = ['Sita Ram', 'Krishna Murthy', 'Lakshmi Devi', 'Arjun Patel'];
    const types: EmergencyAlert['type'][] = ['sos', 'gesture', 'voice'];
    
    const newAlert: EmergencyAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      pilgrimName: names[Math.floor(Math.random() * names.length)],
      pilgrimPhone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      timestamp: Date.now(),
      message: `Emergency ${types[Math.floor(Math.random() * types.length)]} detected!`,
      status: 'active'
    };

    setAlerts(prev => [newAlert, ...prev]);
    updateStats([newAlert, ...alerts]);
  };

  const updateStats = (alertList: EmergencyAlert[]) => {
    const total = alertList.length;
    const active = alertList.filter(a => a.status === 'active').length;
    const resolved = alertList.filter(a => a.status === 'resolved').length;
    
    setStats({
      totalAlerts: total,
      activeAlerts: active,
      resolvedAlerts: resolved,
      avgResponseTime: 3.2 // Mock average
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ff4444';
      case 'acknowledged': return '#ff9500';
      case 'resolved': return '#44bb44';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sos': return '🆘';
      case 'gesture': return '👋';
      case 'voice': return '📢';
      case 'inactivity': return '⏰';
      default: return '🚨';
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🕉️ ShaktiAI Admin Dashboard</h1>
        <p>AI-Powered Emergency Response System - Real-time Monitoring</p>
      </header>

      <main className="dashboard">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Alerts</h3>
            <div className="stat-value">{stats.totalAlerts}</div>
          </div>
          <div className="stat-card active">
            <h3>Active Alerts</h3>
            <div className="stat-value">{stats.activeAlerts}</div>
          </div>
          <div className="stat-card resolved">
            <h3>Resolved</h3>
            <div className="stat-value">{stats.resolvedAlerts}</div>
          </div>
          <div className="stat-card">
            <h3>Avg Response Time</h3>
            <div className="stat-value">{stats.avgResponseTime}min</div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="section">
          <h2>🚨 Active Alerts</h2>
          <div className="alerts-list">
            {alerts.filter(alert => alert.status === 'active').length === 0 ? (
              <div className="empty-state">No active alerts - All good! 👍</div>
            ) : (
              alerts.filter(alert => alert.status === 'active').map(alert => (
                <div key={alert.id} className="alert-card active-alert">
                  <div className="alert-header">
                    <span className="alert-type">
                      {getTypeIcon(alert.type)} {alert.type.toUpperCase()}
                    </span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="alert-content">
                    <div className="pilgrim-info">
                      <strong>{alert.pilgrimName}</strong>
                      <span className="phone">{alert.pilgrimPhone}</span>
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    {alert.location && (
                      <div className="location-info">
                        📍 {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                      </div>
                    )}
                  </div>
                  <div className="alert-status" style={{ color: getStatusColor(alert.status) }}>
                    Status: {alert.status.toUpperCase()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="section">
          <h2>📋 Recent Alerts</h2>
          <div className="alerts-list">
            {alerts.slice(0, 10).map(alert => (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <span className="alert-type">
                    {getTypeIcon(alert.type)} {alert.type.toUpperCase()}
                  </span>
                  <span className="alert-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="alert-content">
                  <div className="pilgrim-info">
                    <strong>{alert.pilgrimName}</strong>
                    <span className="phone">{alert.pilgrimPhone}</span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                  {alert.location && (
                    <div className="location-info">
                      📍 {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                    </div>
                  )}
                  {alert.acknowledgedBy && (
                    <div className="acknowledged-by">
                      ✅ Acknowledged by {alert.acknowledgedBy}
                    </div>
                  )}
                </div>
                <div className="alert-status" style={{ color: getStatusColor(alert.status) }}>
                  Status: {alert.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Responses */}
        <div className="section">
          <h2>👥 Volunteer Responses</h2>
          <div className="responses-list">
            {responses.length === 0 ? (
              <div className="empty-state">No volunteer responses yet</div>
            ) : (
              responses.map((response, idx) => (
                <div key={`${response.alertId}_${idx}`} className="response-card">
                  <div className="response-header">
                    <strong>{response.volunteerName}</strong>
                    <span className="response-time">
                      {new Date(response.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="response-message">{response.message}</div>
                  <div className="response-phone">📱 {response.volunteerPhone}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>ShaktiAI © 2024 - Making pilgrimages safer with AI technology</p>
      </footer>
    </div>
  );
}

export default App;
