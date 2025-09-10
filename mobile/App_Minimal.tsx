import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handlePress = () => {
    Alert.alert('ShaktiAI', 'App is working! Ready to build the full system.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕉️ ShaktiAI</Text>
      <Text style={styles.subtitle}>Emergency Response System</Text>
      
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Test App</Text>
      </TouchableOpacity>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>✅ System Status</Text>
        <Text style={styles.infoText}>• React Native: Working</Text>
        <Text style={styles.infoText}>• Expo: Connected</Text>
        <Text style={styles.infoText}>• Network: 192.168.1.9</Text>
        <Text style={styles.infoText}>• Ready to build full app</Text>
      </View>
      
      <View style={styles.nextSteps}>
        <Text style={styles.nextTitle}>🚀 Next Steps:</Text>
        <Text style={styles.nextText}>1. Test this minimal version</Text>
        <Text style={styles.nextText}>2. Add navigation</Text>
        <Text style={styles.nextText}>3. Add role selection</Text>
        <Text style={styles.nextText}>4. Add dashboards</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  buttonText: {
    color: '#FF6B35',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextSteps: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  nextText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
