import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

import { LoginScreen } from './src/screens/Auth/LoginScreen';
import { TabNavigator } from './src/navigation/TabNavigator';
import { User } from './src/types';
import { authService } from './src/services/authService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = await authService.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    // You can replace this with a proper loading screen
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {user ? (
        <TabNavigator />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});