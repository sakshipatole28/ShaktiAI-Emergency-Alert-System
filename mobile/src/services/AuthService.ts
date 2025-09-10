import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'pilgrim' | 'volunteer';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  volunteerInfo?: {
    skills: string[];
    availability: string;
    experience: string;
  };
  pilgrimInfo?: {
    groupSize: number;
    specialNeeds: string;
  };
  registeredAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'pilgrim' | 'volunteer';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  volunteerInfo?: {
    skills: string[];
    availability: string;
    experience: string;
  };
  pilgrimInfo?: {
    groupSize: number;
    specialNeeds: string;
  };
}

class AuthService {
  private readonly USERS_KEY = 'shakti_users';
  private readonly CURRENT_USER_KEY = 'shakti_current_user';
  private readonly USER_ROLE_KEY = 'userRole';
  
  // Register new user
  async register(userData: RegistrationData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByPhone(userData.phone);
      if (existingUser) {
        return { success: false, message: 'Phone number already registered' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        role: userData.role,
        emergencyContact: userData.emergencyContact,
        volunteerInfo: userData.volunteerInfo,
        pilgrimInfo: userData.pilgrimInfo,
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store user and password
      await this.storeUser(newUser);
      // Store password separately (in real app, this would be hashed)
      await AsyncStorage.setItem(`password_${newUser.phone}`, userData.password);
      await this.setCurrentUser(newUser);
      
      return { 
        success: true, 
        message: 'Registration successful!', 
        user: newUser 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const user = await this.getUserByPhone(credentials.phone);
      
      if (!user) {
        return { success: false, message: 'Phone number not registered' };
      }

      // In a real app, you'd hash and compare passwords
      // For MVP, we'll use a simple password check
      const storedPassword = await AsyncStorage.getItem(`password_${user.phone}`);
      
      if (storedPassword !== credentials.password) {
        return { success: false, message: 'Invalid password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      await this.updateUser(user);
      await this.setCurrentUser(user);
      
      return { 
        success: true, 
        message: 'Login successful!', 
        user 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.CURRENT_USER_KEY,
        this.USER_ROLE_KEY,
      ]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Get user by phone
  private async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      return users.find(user => user.phone === phone) || null;
    } catch (error) {
      console.error('Get user by phone error:', error);
      return null;
    }
  }

  // Store new user
  private async storeUser(user: User): Promise<void> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      users.push(user);
      
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      // Password is stored separately during registration, not here
    } catch (error) {
      console.error('Store user error:', error);
      throw error;
    }
  }

  // Update existing user
  private async updateUser(updatedUser: User): Promise<void> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex(user => user.id === updatedUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  }

  // Set current user
  private async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(this.USER_ROLE_KEY, user.role);
    } catch (error) {
      console.error('Set current user error:', error);
      throw error;
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  // Demo: Create sample users
  async createSampleUsers(): Promise<void> {
    try {
      const existingUsers = await this.getAllUsers();
      if (existingUsers.length > 0) return; // Don't create if users already exist

      const sampleUsers: User[] = [
        {
          id: 'pilgrim_demo_1',
          name: 'Rahul Kumar',
          phone: '9876543210',
          email: 'rahul@example.com',
          role: 'pilgrim',
          emergencyContact: {
            name: 'Priya Kumar',
            phone: '9876543211',
            relationship: 'Wife'
          },
          pilgrimInfo: {
            groupSize: 4,
            specialNeeds: 'Elderly member in group'
          },
          registeredAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        {
          id: 'volunteer_demo_1',
          name: 'Dr. Anita Sharma',
          phone: '9876543220',
          email: 'anita@example.com',
          role: 'volunteer',
          emergencyContact: {
            name: 'Vikash Sharma',
            phone: '9876543221',
            relationship: 'Husband'
          },
          volunteerInfo: {
            skills: ['First Aid', 'Medical Emergency', 'Crowd Management'],
            availability: 'Full Time',
            experience: '5 years medical volunteering'
          },
          registeredAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }
      ];

      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(sampleUsers));
      // Set demo passwords
      await AsyncStorage.setItem('password_9876543210', 'demo123');
      await AsyncStorage.setItem('password_9876543220', 'demo123');
      
      console.log('Sample users created');
    } catch (error) {
      console.error('Create sample users error:', error);
    }
  }
}

export const authService = new AuthService();
