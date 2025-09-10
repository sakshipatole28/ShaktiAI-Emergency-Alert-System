import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

// Import screens
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import PilgrimDashboard from './src/screens/PilgrimDashboard';
import VolunteerDashboard from './src/screens/VolunteerDashboard';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

export type RootStackParamList = {
  RoleSelection: undefined;
  Login: { role: string };
  PilgrimDashboard: undefined;
  VolunteerDashboard: undefined;
};

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    } catch (error) {
      console.error('Error checking user role:', error);
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
        initialRouteName={userRole ? (userRole === 'pilgrim' ? 'PilgrimDashboard' : 'VolunteerDashboard') : 'RoleSelection'}
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
