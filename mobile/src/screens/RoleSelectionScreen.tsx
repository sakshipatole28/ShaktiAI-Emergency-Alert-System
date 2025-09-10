import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>;

type Props = {
  navigation: RoleSelectionScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }: Props) {
  const handleRoleSelection = (role: string) => {
    navigation.navigate('Login', { role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ShaktiAI</Text>
          <Text style={styles.subtitle}>AI-Powered Emergency Response</Text>
          <Text style={styles.description}>
            Choose your role to join the emergency response network
          </Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleCard, styles.pilgrimCard]}
            onPress={() => handleRoleSelection('pilgrim')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>🙏</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Pilgrim</Text>
            <Text style={styles.roleDescription}>
              Get AI-powered emergency detection and instant alert capabilities
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• SOS Button</Text>
              <Text style={styles.feature}>• Gesture Detection</Text>
              <Text style={styles.feature}>• Voice Detection</Text>
              <Text style={styles.feature}>• Auto-Alert System</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, styles.volunteerCard]}
            onPress={() => handleRoleSelection('volunteer')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>🚑</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Volunteer</Text>
            <Text style={styles.roleDescription}>
              Receive emergency alerts and provide assistance to pilgrims
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• Receive Alerts</Text>
              <Text style={styles.feature}>• Location Tracking</Text>
              <Text style={styles.feature}>• Response System</Text>
              <Text style={styles.feature}>• Help Coordination</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Offline-capable • Privacy-focused • Community-driven
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    marginBottom: 20,
  },
  pilgrimCard: {
    borderColor: '#FF6B35',
  },
  volunteerCard: {
    borderColor: '#4ECDC4',
  },
  roleIcon: {
    marginBottom: 16,
  },
  roleEmoji: {
    fontSize: 48,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  featureList: {
    alignItems: 'flex-start',
    width: '100%',
  },
  feature: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 6,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
});
