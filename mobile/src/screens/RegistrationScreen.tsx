import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { authService, RegistrationData } from '../services/AuthService';

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Registration'
>;

type RegistrationScreenRouteProp = RouteProp<RootStackParamList, 'Registration'>;

type Props = {
  navigation: RegistrationScreenNavigationProp;
  route: RegistrationScreenRouteProp;
};

export default function RegistrationScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Basic info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  
  // Pilgrim specific
  const [groupSize, setGroupSize] = useState('1');
  const [specialNeeds, setSpecialNeeds] = useState('');
  
  // Volunteer specific
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');

  const validateForm = (): string | null => {
    if (!name.trim()) return 'Name is required';
    if (!phone.trim()) return 'Phone number is required';
    if (phone.length < 10) return 'Please enter a valid phone number';
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Please enter a valid email';
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    
    // Emergency contact validation
    if (!emergencyName.trim()) return 'Emergency contact name is required';
    if (!emergencyPhone.trim()) return 'Emergency contact phone is required';
    if (!emergencyRelationship.trim()) return 'Emergency contact relationship is required';
    
    // Role specific validation
    if (role === 'pilgrim') {
      const groupSizeNum = parseInt(groupSize);
      if (isNaN(groupSizeNum) || groupSizeNum < 1) return 'Group size must be at least 1';
    }
    
    if (role === 'volunteer') {
      if (!skills.trim()) return 'Skills are required';
      if (!availability.trim()) return 'Availability is required';
    }
    
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setLoading(true);

    try {
      const registrationData: RegistrationData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relationship: emergencyRelationship.trim(),
        },
        ...(role === 'pilgrim' ? {
          pilgrimInfo: {
            groupSize: parseInt(groupSize),
            specialNeeds: specialNeeds.trim(),
          }
        } : {
          volunteerInfo: {
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
            availability: availability.trim(),
            experience: experience.trim(),
          }
        }),
      };

      const result = await authService.register(registrationData);

      if (result.success) {
        Alert.alert(
          'Registration Successful!',
          `Welcome to ShaktiAI, ${name}! You can now use all ${role} features.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                if (role === 'pilgrim') {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'PilgrimDashboard' }],
                  });
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'VolunteerDashboard' }],
                  });
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Join ShaktiAI</Text>
            <Text style={styles.subtitle}>
              Register as {role === 'pilgrim' ? 'a Pilgrim' : 'a Volunteer'}
            </Text>
          </View>

          <View style={styles.form}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password (min 6 characters)"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Name *</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyName}
                  onChangeText={setEmergencyName}
                  placeholder="Emergency contact's name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyPhone}
                  onChangeText={setEmergencyPhone}
                  placeholder="Emergency contact's phone"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relationship *</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyRelationship}
                  onChangeText={setEmergencyRelationship}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Role-specific fields */}
            {role === 'pilgrim' ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pilgrim Information</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Group Size *</Text>
                  <TextInput
                    style={styles.input}
                    value={groupSize}
                    onChangeText={setGroupSize}
                    placeholder="Number of people in your group"
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Special Needs</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={specialNeeds}
                    onChangeText={setSpecialNeeds}
                    placeholder="Any special assistance needed (optional)"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volunteer Information</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Skills *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={skills}
                    onChangeText={setSkills}
                    placeholder="e.g., First Aid, Medical, Navigation, Language Skills (comma separated)"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Availability *</Text>
                  <TextInput
                    style={styles.input}
                    value={availability}
                    onChangeText={setAvailability}
                    placeholder="e.g., Full Time, Weekends, Emergency Only"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Experience</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={experience}
                    onChangeText={setExperience}
                    placeholder="Previous volunteering or emergency response experience (optional)"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Registering...' : 'Complete Registration'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginButtonText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '500',
  },
});
