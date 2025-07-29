import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { UserManagementScreen } from '../screens/Settings/UserManagementScreen';
import { theme } from '../theme';

type SettingsStackParamList = {
  SettingsMain: undefined;
  UserManagement: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

interface SettingsStackNavigatorProps {
  onClose?: () => void;
}

export const SettingsStackNavigator: React.FC<SettingsStackNavigatorProps> = ({ onClose }) => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  onClose?.();
                }
              }}
              style={{ marginLeft: 16 }}
            >
              <Text style={{ color: '#ffffff', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={onClose}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#ffffff', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen 
          name="SettingsMain" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen 
          name="UserManagement" 
          component={UserManagementScreen}
          options={{
            title: 'User Management',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};