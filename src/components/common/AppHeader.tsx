import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { AccountProfile } from '../../types';
import { accountService } from '../../services/accountService';

interface AppHeaderProps {
  onSettingsPress: () => void;
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSettingsPress, title }) => {
  const [currentProfile, setCurrentProfile] = useState<AccountProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<AccountProfile[]>([]);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const [profileResponse, profilesResponse] = await Promise.all([
        accountService.getCurrentProfile(),
        accountService.getAllProfiles(),
      ]);

      if (profileResponse.success && profileResponse.data) {
        setCurrentProfile(profileResponse.data);
      }
      
      if (profilesResponse.success) {
        setAvailableProfiles(profilesResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const handleProfileSwitch = async (profileId: string) => {
    try {
      const result = await accountService.switchProfile(profileId);
      if (result.success) {
        setShowProfileSelector(false);
        await loadProfiles(); // Reload current profile
        // In a real app, you'd want to notify other components to refresh
      }
    } catch (error) {
      console.error('Failed to switch profile:', error);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            {/* Left side - Title or Company Selector */}
            <View style={styles.leftSection}>
              {title ? (
                <Text style={styles.headerTitle}>{title}</Text>
              ) : (
                <TouchableOpacity 
                  style={styles.companySelector}
                  onPress={() => setShowProfileSelector(true)}
                >
                  <Text style={styles.companyName}>
                    {currentProfile?.name || 'Select Profile'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Right side - Settings Button */}
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={onSettingsPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.settingsButtonGradient}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Profile Selector Modal */}
      <Modal
        visible={showProfileSelector}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowProfileSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowProfileSelector(false)}
          />
          <View style={styles.profileModal}>
            <LinearGradient
              colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.95)']}
              style={styles.profileModalContent}
            >
              <Text style={styles.profileModalTitle}>Switch Company Profile</Text>
              {availableProfiles.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  style={[
                    styles.profileOption,
                    currentProfile?.id === profile.id && styles.profileOptionActive
                  ]}
                  onPress={() => handleProfileSwitch(profile.id)}
                >
                  <View style={styles.profileOptionContent}>
                    <Text style={[
                      styles.profileOptionName,
                      currentProfile?.id === profile.id && styles.profileOptionNameActive
                    ]}>
                      {profile.name}
                    </Text>
                    {profile.description && (
                      <Text style={styles.profileOptionDescription}>
                        {profile.description}
                      </Text>
                    )}
                    <Text style={styles.profileOptionMeta}>
                      {profile.accounts.length} account{profile.accounts.length !== 1 ? 's' : ''} • {profile.users.length} user{profile.users.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {currentProfile?.id === profile.id && (
                    <Text style={styles.profileOptionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // Account for status bar
    elevation: 10, // Android shadow
  },
  headerGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
  companySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    maxWidth: 200,
  },
  companyName: {
    fontSize: theme.fontSize.base,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
    marginRight: theme.spacing.sm,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  settingsButton: {
    borderRadius: 24,
    overflow: 'hidden',
    minWidth: 48,
    minHeight: 48,
  },
  settingsButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  settingsIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileModal: {
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.xl,
    maxWidth: 400,
    width: '90%',
  },
  profileModalContent: {
    padding: theme.spacing.lg,
  },
  profileModalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  profileOptionActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  profileOptionContent: {
    flex: 1,
  },
  profileOptionName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  profileOptionNameActive: {
    color: '#6366F1',
  },
  profileOptionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  profileOptionMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
  },
  profileOptionCheck: {
    fontSize: theme.fontSize.lg,
    color: '#6366F1',
    fontWeight: theme.fontWeight.bold,
  },
});