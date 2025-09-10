import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { authService, User } from './src/services/AuthService';

// Import screens
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import PilgrimDashboard from './src/screens/PilgrimDashboard';
import VolunteerDashboard from './src/screens/VolunteerDashboard';

const Stack = createStackNavigator();

export type RootStackParamList = {
  RoleSelection: undefined;
  Login: { role: string };
  Registration: { role: 'pilgrim' | 'volunteer' };
  PilgrimDashboard: undefined;
  VolunteerDashboard: undefined;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={currentUser ? (currentUser.role === 'pilgrim' ? 'PilgrimDashboard' : 'VolunteerDashboard') : 'RoleSelection'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="RoleSelection" 
          component={RoleSelectionScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="Registration" 
          component={RegistrationScreen} 
          options={{ title: 'Registration' }}
        />
        <Stack.Screen 
          name="PilgrimDashboard" 
          component={PilgrimDashboard} 
          options={{ title: 'ShaktiAI - Pilgrim', headerLeft: () => null }}
        />
        <Stack.Screen 
          name="VolunteerDashboard" 
          component={VolunteerDashboard} 
          options={{ title: 'ShaktiAI - Volunteer', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
