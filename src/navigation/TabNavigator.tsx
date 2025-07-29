import React, { useState } from 'react';
import { Text, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';

import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { PaymentsScreen } from '../screens/Payments/PaymentsScreen';
import { ApprovalsScreen } from '../screens/Approvals/ApprovalsScreen';
import { TradeScreen } from '../screens/Trade/TradeScreen';
import { CompaniesScreen } from '../screens/Companies/CompaniesScreen';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import { AppHeader } from '../components/common/AppHeader';
import { NavigationParamList } from '../types';

const Tab = createBottomTabNavigator<NavigationParamList>();

export const TabNavigator: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const iconText = (() => {
                switch (route.name) {
                  case 'Dashboard': return '🏠';
                  case 'Payments': return '💸';
                  case 'Approvals': return '✅';
                  case 'Trade': return '🔄';
                  case 'Companies': return '🏢';
                  default: return '●';
                }
              })();

              return (
                <Text style={{
                  fontSize: size * 0.8,
                  color: color,
                  textAlign: 'center'
                }}>
                  {iconText}
                </Text>
              );
            },
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e9ecef',
              borderTopWidth: 1,
              paddingVertical: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 5,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Dashboard',
            }}
          />
          <Tab.Screen 
            name="Payments" 
            component={PaymentsScreen}
            options={{
              tabBarLabel: 'Payments',
            }}
          />
          <Tab.Screen 
            name="Approvals" 
            component={ApprovalsScreen}
            options={{
              tabBarLabel: 'Approvals',
            }}
          />
          <Tab.Screen 
            name="Trade" 
            component={TradeScreen}
            options={{
              tabBarLabel: 'Trade',
            }}
          />
          <Tab.Screen 
            name="Companies" 
            component={CompaniesScreen}
            options={{
              tabBarLabel: 'Companies',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      
      {/* Global App Header - moved outside NavigationContainer */}
      <AppHeader 
        onSettingsPress={() => setShowSettings(true)}
      />
      
      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowSettings(false)}
      >
        <SettingsStackNavigator onClose={() => setShowSettings(false)} />
      </Modal>
    </>
  );
};