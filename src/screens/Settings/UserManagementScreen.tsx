import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';
import { ConfigurationSettings, User, AccountProfile } from '../../types';
import { configurationService } from '../../services/configurationService';
import { accountService } from '../../services/accountService';

export const UserManagementScreen: React.FC = () => {
  const [config, setConfig] = useState<ConfigurationSettings | null>(null);
  const [currentProfile, setCurrentProfile] = useState<AccountProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [configResponse, profileResponse] = await Promise.all([
        configurationService.getConfiguration(),
        accountService.getCurrentProfile(),
      ]);

      if (configResponse.success) {
        setConfig(configResponse.data || null);
      }
      if (profileResponse.success && profileResponse.data) {
        setCurrentProfile(profileResponse.data);
        // Mock current user - in real app, this would come from auth context
        const mockUser = profileResponse.data.users[0];
        setCurrentUser(mockUser);
        setProfileForm({
          name: mockUser.name,
          email: mockUser.email,
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSetting = async (key: keyof ConfigurationSettings['notifications'], value: boolean) => {
    if (!config) return;

    try {
      const updates = {
        notifications: { ...config.notifications, [key]: value }
      };
      const response = await configurationService.updateConfiguration(updates);
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to update notification setting:', error);
    }
  };

  const updateSecuritySetting = async (key: keyof ConfigurationSettings['security'], value: any) => {
    if (!config) return;

    try {
      const updates = {
        security: { ...config.security, [key]: value }
      };
      const response = await configurationService.updateConfiguration(updates);
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to update security setting:', error);
    }
  };

  const saveProfile = () => {
    // Mock save - in real app would call API
    setCurrentUser(prev => prev ? { ...prev, name: profileForm.name, email: profileForm.email } : null);
    setEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const changePassword = () => {
    Alert.alert(
      'Change Password',
      'This would typically open a secure password change flow.',
      [{ text: 'OK' }]
    );
  };

  const setup2FA = () => {
    Alert.alert(
      'Two-Factor Authentication',
      'This would guide you through setting up 2FA with an authenticator app.',
      [{ text: 'OK' }]
    );
  };

  const manageSessions = () => {
    Alert.alert(
      'Active Sessions',
      'Current session: iPhone 14 Pro (this device)\nWeb session: Chrome on MacBook Pro (2 hours ago)\n\nWould you like to end other sessions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Other Sessions', style: 'destructive' }
      ]
    );
  };

  if (loading || !config || !currentUser) {
    return (
      <LinearGradient
        colors={[theme.colors.gray[50], theme.colors.white]}
        style={styles.centerContainer}
      >
        <Text style={styles.loadingText}>Loading user settings...</Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#f5f5f5']}
          locations={[0, 0.3, 1]}
          style={styles.backgroundGradient}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerBlur}>
                <Text style={styles.headerTitle}>User Management</Text>
                <Text style={styles.headerSubtitle}>
                  {currentUser.name} • {currentUser.role}
                </Text>
              </View>
            </View>

            <View style={styles.content}>
              {/* Personal Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.95)']}
                    style={styles.cardGradient}
                  >
                    {editingProfile ? (
                      <>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Full Name</Text>
                          <TextInput
                            style={styles.textInput}
                            value={profileForm.name}
                            onChangeText={(text) => setProfileForm(prev => ({ ...prev, name: text }))}
                            placeholder="Enter your full name"
                          />
                        </View>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Email Address</Text>
                          <TextInput
                            style={styles.textInput}
                            value={profileForm.email}
                            onChangeText={(text) => setProfileForm(prev => ({ ...prev, email: text }))}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>
                        <View style={styles.buttonRow}>
                          <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => {
                              setEditingProfile(false);
                              setProfileForm({
                                name: currentUser.name,
                                email: currentUser.email,
                              });
                            }}
                          >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={saveProfile}
                          >
                            <LinearGradient
                              colors={['#6366F1', '#8B5CF6']}
                              style={styles.saveButtonGradient}
                            >
                              <Text style={styles.saveButtonText}>Save</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.profileInfo}>
                          <Text style={styles.profileName}>{currentUser.name}</Text>
                          <Text style={styles.profileEmail}>{currentUser.email}</Text>
                          <Text style={styles.profileRole}>Role: {currentUser.role}</Text>
                          <Text style={styles.profileId}>User ID: {currentUser.id}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.editButton}
                          onPress={() => setEditingProfile(true)}
                        >
                          <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </LinearGradient>
                </View>
              </View>

              {/* Security Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security Settings</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.95)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={changePassword}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Change Password</Text>
                        <Text style={styles.settingSubtitle}>Update your account password</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={setup2FA}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                        <Text style={styles.settingSubtitle}>Add extra security to your account</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>

                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Biometric Authentication</Text>
                        <Text style={styles.settingSubtitle}>Use Face ID or Touch ID</Text>
                      </View>
                      <Switch
                        value={config.security.biometric}
                        onValueChange={(value) => updateSecuritySetting('biometric', value)}
                        trackColor={{ false: theme.colors.gray[300], true: '#6366F1' }}
                        thumbColor={config.security.biometric ? '#fff' : '#f4f3f4'}
                      />
                    </View>

                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => {
                        const timeouts = [300000, 900000, 1800000, 3600000]; // 5, 15, 30, 60 minutes
                        const current = timeouts.indexOf(config.security.sessionTimeout);
                        const next = timeouts[(current + 1) % timeouts.length];
                        updateSecuritySetting('sessionTimeout', next);
                      }}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Session Timeout</Text>
                        <Text style={styles.settingSubtitle}>Auto-logout after inactivity</Text>
                      </View>
                      <Text style={styles.settingValue}>
                        {config.security.sessionTimeout / 60000} min
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={manageSessions}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Active Sessions</Text>
                        <Text style={styles.settingSubtitle}>Manage logged-in devices</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Notification Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Preferences</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.95)']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Transaction Notifications</Text>
                        <Text style={styles.settingSubtitle}>Get notified about transfers and payments</Text>
                      </View>
                      <Switch
                        value={config.notifications.transactions}
                        onValueChange={(value) => updateNotificationSetting('transactions', value)}
                        trackColor={{ false: theme.colors.gray[300], true: '#6366F1' }}
                        thumbColor={config.notifications.transactions ? '#fff' : '#f4f3f4'}
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Approval Requests</Text>
                        <Text style={styles.settingSubtitle}>Get notified when approvals are needed</Text>
                      </View>
                      <Switch
                        value={config.notifications.approvals}
                        onValueChange={(value) => updateNotificationSetting('approvals', value)}
                        trackColor={{ false: theme.colors.gray[300], true: '#6366F1' }}
                        thumbColor={config.notifications.approvals ? '#fff' : '#f4f3f4'}
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Low Balance Alerts</Text>
                        <Text style={styles.settingSubtitle}>Get warned when balances are low</Text>
                      </View>
                      <Switch
                        value={config.notifications.lowBalance}
                        onValueChange={(value) => updateNotificationSetting('lowBalance', value)}
                        trackColor={{ false: theme.colors.gray[300], true: '#6366F1' }}
                        thumbColor={config.notifications.lowBalance ? '#fff' : '#f4f3f4'}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Role & Permissions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Role & Permissions</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.95)']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.roleInfo}>
                      <Text style={styles.roleTitle}>Current Role: {currentUser.role}</Text>
                      <Text style={styles.roleDescription}>
                        {currentUser.role === 'admin' ? 
                          'Full access to all features including user management, settings, and approvals.' :
                          currentUser.role === 'approver' ?
                          'Can approve transactions and view account information.' :
                          'Can view account information and initiate transactions.'
                        }
                      </Text>
                      <View style={styles.permissionsList}>
                        <Text style={styles.permissionsTitle}>Your Permissions:</Text>
                        <Text style={styles.permissionItem}>• View account balances</Text>
                        <Text style={styles.permissionItem}>• Initiate transfers</Text>
                        {(currentUser.role === 'admin' || currentUser.role === 'approver') && (
                          <Text style={styles.permissionItem}>• Approve transactions</Text>
                        )}
                        {currentUser.role === 'admin' && (
                          <>
                            <Text style={styles.permissionItem}>• Manage users</Text>
                            <Text style={styles.permissionItem}>• Configure settings</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: theme.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing['2xl'],
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  headerBlur: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.xl,
  },
  headerTitle: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: theme.fontWeight.medium,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  floatingCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  cardGradient: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
  },
  profileInfo: {
    marginBottom: theme.spacing.lg,
  },
  profileName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.xs,
  },
  profileRole: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  profileId: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    fontFamily: 'monospace',
  },
  editButton: {
    backgroundColor: '#6366F1',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  editButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    backgroundColor: theme.colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
  },
  saveButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  settingValue: {
    fontSize: theme.fontSize.base,
    color: '#6366F1',
    fontWeight: theme.fontWeight.semibold,
  },
  settingArrow: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.gray[400],
    fontWeight: theme.fontWeight.light,
  },
  roleInfo: {
    paddingVertical: theme.spacing.sm,
  },
  roleTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    textTransform: 'capitalize',
  },
  roleDescription: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[700],
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  permissionsList: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  permissionsTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
    marginBottom: theme.spacing.sm,
  },
  permissionItem: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.xs,
  },
});