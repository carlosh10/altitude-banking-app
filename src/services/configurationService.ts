import { ConfigurationSettings, AccountProfile, ApiResponse, Account, User, MultisigConfig } from '../types';

class ConfigurationService {
  private readonly STORAGE_KEY_CONFIG = 'app_configuration';
  private readonly STORAGE_KEY_PROFILES = 'account_profiles';

  async getConfiguration(): Promise<ApiResponse<ConfigurationSettings>> {
    try {
      const defaultConfig: ConfigurationSettings = {
        theme: 'auto',
        notifications: {
          transactions: true,
          approvals: true,
          lowBalance: true,
        },
        security: {
          biometric: false,
          sessionTimeout: 900000, // 15 minutes
        },
        display: {
          currency: 'USD',
          showTestAccounts: false,
        },
      };

      // In a real app, this would read from secure storage
      const savedConfig = this.loadFromStorage(this.STORAGE_KEY_CONFIG);
      const config = { ...defaultConfig, ...savedConfig };

      return { success: true, data: config };
    } catch (error) {
      return { success: false, error: 'Failed to load configuration' };
    }
  }

  async updateConfiguration(config: Partial<ConfigurationSettings>): Promise<ApiResponse<ConfigurationSettings>> {
    try {
      const currentResponse = await this.getConfiguration();
      if (!currentResponse.success || !currentResponse.data) {
        return { success: false, error: 'Failed to load current configuration' };
      }

      const updatedConfig = { ...currentResponse.data, ...config };
      this.saveToStorage(this.STORAGE_KEY_CONFIG, updatedConfig);

      return { success: true, data: updatedConfig };
    } catch (error) {
      return { success: false, error: 'Failed to update configuration' };
    }
  }

  async getAccountProfiles(): Promise<ApiResponse<AccountProfile[]>> {
    try {
      // Mock data - in a real app, this would come from API
      const mockProfiles: AccountProfile[] = [
        {
          id: 'profile_main',
          name: 'Main Business',
          description: 'Primary business accounts',
          accounts: [
            {
              id: 'acc_usd_1',
              name: 'Business USD Account',
              currency: 'USD',
              balance: 125000.50,
              yieldRate: 4.2,
              type: 'checking',
              achInfo: {
                routingNumber: '021000021',
                accountNumber: '1234567890',
                bankName: 'Chase Bank',
                accountType: 'checking',
              },
              wireInfo: {
                bankName: 'JPMorgan Chase Bank, N.A.',
                accountNumber: '1234567890',
                routingNumber: '021000021',
                accountHolderName: 'Business Account LLC',
                swiftCode: 'CHASUS33',
                bankAddress: '270 Park Avenue, New York, NY 10017',
                intermediaryBank: {
                  name: 'Federal Reserve Bank of New York',
                  swiftCode: 'FRNYUS33',
                  accountNumber: '021000021',
                },
              },
            },
            {
              id: 'acc_brl_1',
              name: 'Business BRL Account',
              currency: 'BRL',
              balance: 650000.00,
              yieldRate: 8.5,
              type: 'checking',
              pixInfo: {
                keys: {
                  email: 'business@company.com',
                  phone: '+5511999887766',
                  cnpj: '12.345.678/0001-90',
                  randomKey: '7f8b2c4d-1a3e-4f5g-9h2i-6j7k8l9m0n1o',
                },
                bankCode: '001',
                bankName: 'Banco do Brasil',
                agency: '1234-5',
                accountNumber: '56789-0',
                accountType: 'corrente',
              },
            },
          ],
          users: [
            {
              id: 'user_123',
              email: 'admin@business.com',
              name: 'Admin User',
              role: 'admin',
              publicKey: 'pub_key_123',
            },
          ],
          multisigConfig: {
            threshold: 2,
            members: ['user_123', 'user_456'],
            squadId: 'squad_main',
          },
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'profile_trading',
          name: 'Trading Account',
          description: 'High-frequency trading operations',
          accounts: [
            {
              id: 'acc_usd_trading',
              name: 'USD Trading Account',
              currency: 'USD',
              balance: 50000.00,
              yieldRate: 3.8,
              type: 'trading',
            },
          ],
          users: [
            {
              id: 'user_trader',
              email: 'trader@business.com',
              name: 'Trader User',
              role: 'member',
              publicKey: 'pub_key_trader',
            },
          ],
          multisigConfig: {
            threshold: 1,
            members: ['user_trader'],
            squadId: 'squad_trading',
          },
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return { success: true, data: mockProfiles };
    } catch (error) {
      return { success: false, error: 'Failed to load account profiles' };
    }
  }

  async createAccountProfile(profile: Omit<AccountProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AccountProfile>> {
    try {
      const newProfile: AccountProfile = {
        ...profile,
        id: `profile_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, this would save to API
      return { success: true, data: newProfile };
    } catch (error) {
      return { success: false, error: 'Failed to create account profile' };
    }
  }

  async updateAccountProfile(profileId: string, updates: Partial<AccountProfile>): Promise<ApiResponse<AccountProfile>> {
    try {
      const profilesResponse = await this.getAccountProfiles();
      if (!profilesResponse.success || !profilesResponse.data) {
        return { success: false, error: 'Failed to load profiles' };
      }

      const profile = profilesResponse.data.find(p => p.id === profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      const updatedProfile: AccountProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return { success: true, data: updatedProfile };
    } catch (error) {
      return { success: false, error: 'Failed to update account profile' };
    }
  }

  async setDefaultProfile(profileId: string): Promise<ApiResponse<void>> {
    try {
      const config = await this.updateConfiguration({ defaultAccountProfile: profileId });
      return { success: config.success };
    } catch (error) {
      return { success: false, error: 'Failed to set default profile' };
    }
  }

  async getCurrentProfile(): Promise<ApiResponse<AccountProfile>> {
    try {
      const configResponse = await this.getConfiguration();
      const profilesResponse = await this.getAccountProfiles();

      if (!configResponse.success || !profilesResponse.success || !profilesResponse.data) {
        return { success: false, error: 'Failed to load configuration or profiles' };
      }

      const defaultProfileId = configResponse.data?.defaultAccountProfile;
      let currentProfile = profilesResponse.data.find(p => p.isDefault);

      if (defaultProfileId) {
        const preferredProfile = profilesResponse.data.find(p => p.id === defaultProfileId);
        if (preferredProfile) {
          currentProfile = preferredProfile;
        }
      }

      if (!currentProfile) {
        currentProfile = profilesResponse.data[0];
      }

      if (!currentProfile) {
        return { success: false, error: 'No profiles available' };
      }

      return { success: true, data: currentProfile };
    } catch (error) {
      return { success: false, error: 'Failed to get current profile' };
    }
  }

  private loadFromStorage(key: string): any {
    // Mock implementation - in a real app, use AsyncStorage or SecureStore
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  private saveToStorage(key: string, data: any): void {
    // Mock implementation - in a real app, use AsyncStorage or SecureStore
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
}

export const configurationService = new ConfigurationService();