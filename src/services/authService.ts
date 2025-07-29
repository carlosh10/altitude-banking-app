import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ApiResponse } from '@/types';

class AuthService {
  private readonly USER_KEY = 'user_data';
  private readonly TOKEN_KEY = 'auth_token';

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const user: User = {
        id: 'user_123',
        email,
        name: 'John Doe',
        role: 'admin',
        publicKey: '11111111111111111111111111111112', // Mock public key
      };

      // Store user data
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(this.TOKEN_KEY, 'mock_token_' + Date.now());

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.USER_KEY, this.TOKEN_KEY]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }
}

export const authService = new AuthService();