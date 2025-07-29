import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';
import { ConfigurationSettings, AccountProfile, Account } from '../../types';
import { configurationService } from '../../services/configurationService';
import { accountService } from '../../services/accountService';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [config, setConfig] = useState<ConfigurationSettings | null>(null);
  const [currentProfile, setCurrentProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [configResponse, profileResponse] = await Promise.all([
        configurationService.getConfiguration(),
        accountService.getCurrentProfile(),
      ]);

      if (configResponse.success) {
        setConfig(configResponse.data || null);
      }
      if (profileResponse.success) {
        setCurrentProfile(profileResponse.data || null);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (updates: Partial<ConfigurationSettings>) => {
    if (!config) return;

    try {
      const response = await configurationService.updateConfiguration(updates);
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual logout logic
            Alert.alert('Success', 'You have been logged out');
          }
        },
      ]
    );
  };

  const showFeesInfo = () => {
    Alert.alert(
      'Fees Structure',
      'Transfer Fee: 0.1%\nCurrency Swap Fee: 0.25%\nDeposit Fee: Free\nWithdrawal Fee: $2.50 USD / R$12.50 BRL\nNetwork Fees: Variable'
    );
  };

  const showExchangeRates = () => {
    Alert.alert(
      'Current Exchange Rates',
      'USD/BRL: 5.20\nBRL/USD: 0.19\n\n*Rates updated every 30 seconds\n*Includes 0.25% spread'
    );
  };

  const showSupport = () => {
    Alert.alert(
      'Support',
      'Email: support@company.com\nPhone: +1 (555) 123-4567\nLive Chat: Available 24/7\n\nFor urgent issues, please contact our emergency hotline.'
    );
  };

  if (loading || !config) {
    return (
      <LinearGradient
        colors={[theme.colors.gray[50], theme.colors.white]}
        style={styles.centerContainer}
      >
        <Text style={styles.loadingText}>Loading settings...</Text>
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

            <View style={styles.content}>
              {/* Your Profile */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Profile</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => navigation.navigate('UserManagement')}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Personal Information</Text>
                        <Text style={styles.settingSubtitle}>Name, email, phone</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => navigation.navigate('UserManagement')}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Security Settings</Text>
                        <Text style={styles.settingSubtitle}>Password, 2FA, biometrics</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => navigation.navigate('UserManagement')}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Notification Preferences</Text>
                        <Text style={styles.settingSubtitle}>Email, push, SMS</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Users Management */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Users Management</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Manage Users</Text>
                        <Text style={styles.settingSubtitle}>
                          Add, edit, or remove users • {currentProfile?.users.length || 0} active users
                        </Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>User Roles & Permissions</Text>
                        <Text style={styles.settingSubtitle}>Configure access levels and permissions</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Pending Invitations</Text>
                        <Text style={styles.settingSubtitle}>View and manage pending user invites</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>User Activity Log</Text>
                        <Text style={styles.settingSubtitle}>Monitor user actions and login history</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* User Groups Management */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Groups</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Manage Groups</Text>
                        <Text style={styles.settingSubtitle}>Create and manage user groups</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Group Permissions</Text>
                        <Text style={styles.settingSubtitle}>Set permissions for user groups</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Group Assignments</Text>
                        <Text style={styles.settingSubtitle}>Assign users to groups</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Deposit Account Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Deposit Account Details</Text>
                {currentProfile?.accounts.map((account) => (
                  <View key={account.id} style={styles.floatingCard}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                      style={styles.cardGradient}
                    >
                      <View style={styles.accountHeader}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountType}>
                          {account.type} • {account.currency}
                        </Text>
                        <Text style={styles.accountBalance}>
                          {account.currency === 'USD' ? '$' : 'R$'}
                          {account.balance.toLocaleString()}
                        </Text>
                      </View>

                      {account.currency === 'USD' && account.achInfo && (
                        <View style={styles.paymentSection}>
                          <Text style={styles.paymentSectionTitle}>ACH Information</Text>
                          <View style={styles.paymentDetails}>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Bank Name:</Text>
                              <Text style={styles.detailValue}>{account.achInfo.bankName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Routing Number:</Text>
                              <Text style={styles.detailValue}>{account.achInfo.routingNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Account Number:</Text>
                              <Text style={styles.detailValue}>{account.achInfo.accountNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Account Type:</Text>
                              <Text style={styles.detailValue}>{account.achInfo.accountType}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {account.currency === 'USD' && account.wireInfo && (
                        <View style={styles.paymentSection}>
                          <Text style={styles.paymentSectionTitle}>Wire Transfer Information</Text>
                          <View style={styles.paymentDetails}>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Bank Name:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.bankName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>SWIFT Code:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.swiftCode}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Account Number:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.accountNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Routing Number:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.routingNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Account Holder:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.accountHolderName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Bank Address:</Text>
                              <Text style={styles.detailValue}>{account.wireInfo.bankAddress}</Text>
                            </View>
                            {account.wireInfo.intermediaryBank && (
                              <>
                                <Text style={styles.intermediaryTitle}>Intermediary Bank:</Text>
                                <View style={styles.detailRow}>
                                  <Text style={styles.detailLabel}>Bank Name:</Text>
                                  <Text style={styles.detailValue}>{account.wireInfo.intermediaryBank.name}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                  <Text style={styles.detailLabel}>SWIFT Code:</Text>
                                  <Text style={styles.detailValue}>{account.wireInfo.intermediaryBank.swiftCode}</Text>
                                </View>
                              </>
                            )}
                          </View>
                        </View>
                      )}

                      {account.currency === 'BRL' && account.pixInfo && (
                        <View style={styles.paymentSection}>
                          <Text style={styles.paymentSectionTitle}>PIX Information</Text>
                          <View style={styles.paymentDetails}>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Bank:</Text>
                              <Text style={styles.detailValue}>{account.pixInfo.bankName} ({account.pixInfo.bankCode})</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Agency:</Text>
                              <Text style={styles.detailValue}>{account.pixInfo.agency}</Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Account:</Text>
                              <Text style={styles.detailValue}>{account.pixInfo.accountNumber} ({account.pixInfo.accountType})</Text>
                            </View>
                            
                            <Text style={styles.pixKeysTitle}>PIX Keys:</Text>
                            {account.pixInfo.keys.email && (
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email:</Text>
                                <Text style={styles.detailValue}>{account.pixInfo.keys.email}</Text>
                              </View>
                            )}
                            {account.pixInfo.keys.phone && (
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phone:</Text>
                                <Text style={styles.detailValue}>{account.pixInfo.keys.phone}</Text>
                              </View>
                            )}
                            {account.pixInfo.keys.cnpj && (
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>CNPJ:</Text>
                                <Text style={styles.detailValue}>{account.pixInfo.keys.cnpj}</Text>
                              </View>
                            )}
                            {account.pixInfo.keys.randomKey && (
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Random Key:</Text>
                                <Text style={styles.detailValue}>{account.pixInfo.keys.randomKey}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                ))}
              </View>

              {/* Linked Payment Accounts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Linked Payment Accounts</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Bank Accounts</Text>
                        <Text style={styles.settingSubtitle}>2 accounts linked</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Credit Cards</Text>
                        <Text style={styles.settingSubtitle}>1 card linked</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Digital Wallets</Text>
                        <Text style={styles.settingSubtitle}>Not linked</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Display Settings */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Display</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => {
                        const newCurrency = config.display.currency === 'USD' ? 'BRL' : 'USD';
                        updateSetting({
                          display: { ...config.display, currency: newCurrency }
                        });
                      }}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Display Currency</Text>
                        <Text style={styles.settingSubtitle}>Primary currency for display</Text>
                      </View>
                      <Text style={styles.settingValue}>{config.display.currency}</Text>
                    </TouchableOpacity>

                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Show Test Accounts</Text>
                        <Text style={styles.settingSubtitle}>Display development accounts</Text>
                      </View>
                      <Switch
                        value={config.display.showTestAccounts}
                        onValueChange={(value) => 
                          updateSetting({
                            display: { ...config.display, showTestAccounts: value }
                          })
                        }
                        trackColor={{ false: theme.colors.gray[300], true: '#6366F1' }}
                        thumbColor={config.display.showTestAccounts ? '#fff' : '#f4f3f4'}
                      />
                    </View>

                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={() => {
                        const themes = ['light', 'dark', 'auto'] as const;
                        const currentIndex = themes.indexOf(config.theme);
                        const nextTheme = themes[(currentIndex + 1) % themes.length];
                        updateSetting({ theme: nextTheme });
                      }}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Theme</Text>
                        <Text style={styles.settingSubtitle}>App appearance</Text>
                      </View>
                      <Text style={styles.settingValue}>{config.theme}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>


              {/* Financial Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Financial Information</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={showFeesInfo}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Fees</Text>
                        <Text style={styles.settingSubtitle}>View current fee structure</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={showExchangeRates}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Exchange Rates</Text>
                        <Text style={styles.settingSubtitle}>Current USD/BRL rates</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Support */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    <TouchableOpacity 
                      style={styles.settingItem}
                      onPress={showSupport}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Contact Support</Text>
                        <Text style={styles.settingSubtitle}>Get help with your account</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>FAQ</Text>
                        <Text style={styles.settingSubtitle}>Frequently asked questions</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>Privacy Policy</Text>
                        <Text style={styles.settingSubtitle}>How we protect your data</Text>
                      </View>
                      <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Logout */}
              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.logoutGradient}
                  >
                    <Text style={styles.logoutText}>Logout</Text>
                  </LinearGradient>
                </TouchableOpacity>
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
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
    textTransform: 'uppercase',
  },
  settingArrow: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.gray[400],
    fontWeight: theme.fontWeight.light,
  },
  accountItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  accountDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  accountId: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
    fontFamily: 'monospace',
  },
  logoutButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  logoutGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
  accountHeader: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  accountType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
  },
  paymentSection: {
    marginBottom: theme.spacing.lg,
  },
  paymentSectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.md,
  },
  paymentDetails: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    flex: 1,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[900],
    fontFamily: 'monospace',
    flex: 2,
    textAlign: 'right',
  },
  intermediaryTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  pixKeysTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
});