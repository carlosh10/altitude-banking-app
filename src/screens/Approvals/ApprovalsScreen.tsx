import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Transaction, Approval } from '../../types';
import { approvalsService } from '../../services/approvalsService';
import { GradientButton } from '../../components/common/GradientButton';
import { GradientCard } from '../../components/common/GradientCard';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface PendingApproval extends Transaction {
  approvals: Approval[];
  canApprove: boolean;
}

export const ApprovalsScreen: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadPendingApprovals = async () => {
    try {
      const response = await approvalsService.getPendingApprovals();
      if (response.success) {
        setPendingApprovals(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingApprovals();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const handleApproval = async (transactionId: string, approved: boolean) => {
    setProcessingId(transactionId);
    try {
      const response = await approvalsService.submitApproval(transactionId, approved);
      
      if (response.success) {
        Alert.alert(
          'Success',
          `Transaction ${approved ? 'approved' : 'rejected'} successfully`,
          [{ text: 'OK', onPress: loadPendingApprovals }]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to submit approval');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit approval. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const ApprovalCard: React.FC<{ approval: PendingApproval }> = ({ approval }) => {
    const approvedCount = approval.approvals.filter(a => a.status === 'approved').length;
    const rejectedCount = approval.approvals.filter(a => a.status === 'rejected').length;
    const progressPercentage = (approvedCount / approval.requiredApprovals) * 100;
    const isProcessing = processingId === approval.id;

    const getStatusColor = () => {
      if (rejectedCount > 0) return theme.gradients.danger;
      if (approvedCount >= approval.requiredApprovals) return theme.gradients.success;
      return theme.gradients.warning;
    };

    const getTypeEmoji = () => {
      switch (approval.type) {
        case 'transfer': return '💸';
        case 'swap': return '🔄';
        case 'withdrawal': return '🏧';
        case 'deposit': return '⬇️';
        default: return '📄';
      }
    };

    return (
      <View style={styles.floatingCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.cardGradient}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.typeContainer}>
                <View style={styles.typeIconContainer}>
                  <LinearGradient
                    colors={
                      approval.type === 'transfer' ? ['#6366F1', '#8B5CF6'] :
                      approval.type === 'swap' ? ['#F59E0B', '#FBBF24'] :
                      approval.type === 'withdrawal' ? ['#EF4444', '#F87171'] :
                      ['#10B981', '#34D399']
                    }
                    style={styles.typeIconGradient}
                  >
                    <Text style={styles.typeEmoji}>{getTypeEmoji()}</Text>
                  </LinearGradient>
                </View>
                <View style={styles.typeInfo}>
                  <Text style={styles.transactionType}>
                    {approval.type.charAt(0).toUpperCase() + approval.type.slice(1)}
                  </Text>
                  <Text style={styles.transactionId}>ID: {approval.id.slice(-8)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <LinearGradient
                colors={approval.currency === 'USD' ? theme.gradients.usd : theme.gradients.brl}
                style={styles.amountBadge}
              >
                <Text style={styles.amountText}>
                  {approval.currency} {approval.amount.toLocaleString()}
                </Text>
              </LinearGradient>
              {approval.exchangeRate && (
                <Text style={styles.exchangeRateText}>
                  Rate: {approval.exchangeRate.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

        {/* Transaction Details */}
        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value} numberOfLines={1}>{approval.from}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value} numberOfLines={1}>{approval.to}</Text>
          </View>
          {approval.description && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Note</Text>
              <Text style={styles.value} numberOfLines={2}>{approval.description}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>
              {new Date(approval.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Approvals: {approvedCount}/{approval.requiredApprovals}
            </Text>
            <LinearGradient
              colors={getStatusColor()}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>
                {rejectedCount > 0 ? `${rejectedCount} Rejected` : 
                 approvedCount >= approval.requiredApprovals ? 'Complete' : 'Pending'}
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={theme.gradients.success}
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>

          {/* Approvals List */}
          <View style={styles.approvalsList}>
            {approval.approvals.map((appr, index) => (
              <View key={index} style={styles.approvalItem}>
                <Text style={styles.approverName}>
                  👤 User {appr.userId.slice(-4)}
                </Text>
                <View style={[
                  styles.approvalStatusBadge,
                  appr.status === 'approved' && styles.approvedBadge,
                  appr.status === 'rejected' && styles.rejectedBadge,
                ]}>
                  <Text style={[
                    styles.approvalStatus,
                    appr.status === 'approved' && styles.approvedText,
                    appr.status === 'rejected' && styles.rejectedText,
                  ]}>
                    {appr.status === 'approved' ? '✓' : '✗'} {appr.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

          {/* Action Buttons */}
          {approval.canApprove && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleApproval(approval.id, false)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color={theme.colors.error} size="small" />
                ) : (
                  <>
                    <Text style={styles.rejectIcon}>✗</Text>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <GradientButton
                title={isProcessing ? 'Processing...' : '✓ Approve'}
                onPress={() => handleApproval(approval.id, true)}
                loading={isProcessing}
                variant="success"
                style={styles.approveButtonWrapper}
              />
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.backgroundGradient}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.white} />
          <Text style={styles.loadingText}>Loading approvals...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#f5f5f5']}
          locations={[0, 0.4, 1]}
          style={styles.backgroundGradient}
        >
          {/* Floating Header */}
          <View style={styles.header}>
            <View style={styles.headerBlur}>
              <Text style={styles.title}>Approvals</Text>
              <Text style={styles.subtitle}>
                {pendingApprovals.length} pending transaction{pendingApprovals.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="rgba(255,255,255,0.8)"
                colors={[theme.colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {pendingApprovals.length === 0 ? (
              <View style={styles.floatingCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✅</Text>
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptySubtitle}>
                      No pending approvals at the moment. All transactions have been processed.
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.approvalsList}>
                {pendingApprovals.map(approval => (
                  <ApprovalCard key={approval.id} approval={approval} />
                ))}
              </View>
            )}
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
    fontSize: theme.fontSize.base,
    color: 'rgba(255,255,255,0.8)',
    marginTop: theme.spacing.md,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  headerBlur: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.xl,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  floatingCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  cardGradient: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
  },
  approvalsList: {
    gap: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  typeIconContainer: {
    marginRight: theme.spacing.md,
  },
  typeIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  typeInfo: {
    flex: 1,
  },
  typeEmoji: {
    fontSize: theme.fontSize.lg,
  },
  transactionType: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  transactionId: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  amountText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  exchangeRateText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[500],
  },
  cardContent: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
    width: 70,
  },
  value: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[900],
    fontWeight: theme.fontWeight.medium,
    flex: 1,
    textAlign: 'right',
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[600],
    minWidth: 30,
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  approverName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.medium,
  },
  approvalStatusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  approvedBadge: {
    backgroundColor: theme.colors.success,
  },
  rejectedBadge: {
    backgroundColor: theme.colors.error,
  },
  approvalStatus: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[600],
    textTransform: 'capitalize',
  },
  approvedText: {
    color: theme.colors.white,
  },
  rejectedText: {
    color: theme.colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...theme.shadows.sm,
  },
  rejectButton: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectIcon: {
    fontSize: theme.fontSize.base,
    color: theme.colors.error,
    marginRight: theme.spacing.sm,
  },
  rejectButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.error,
  },
  approveButtonWrapper: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.lg,
  },
});