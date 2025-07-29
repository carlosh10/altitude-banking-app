import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Transaction, Approval } from '../../types';
import { approvalsService } from '../../services/approvalsService';

interface PendingApproval extends Transaction {
  approvals: Approval[];
  canApprove: boolean;
}

export const ApprovalsScreen: React.FC = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    }
  };

  const ApprovalCard: React.FC<{ approval: PendingApproval }> = ({ approval }) => {
    const approvedCount = approval.approvals.filter(a => a.status === 'approved').length;
    const rejectedCount = approval.approvals.filter(a => a.status === 'rejected').length;
    const progressPercentage = (approvedCount / approval.requiredApprovals) * 100;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.transactionType}>
              {approval.type.charAt(0).toUpperCase() + approval.type.slice(1)}
            </Text>
            <Text style={styles.transactionId}>ID: {approval.id.slice(-8)}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {approval.currency} {approval.amount.toLocaleString()}
            </Text>
            {approval.exchangeRate && (
              <Text style={styles.exchangeRate}>
                Rate: {approval.exchangeRate.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{approval.from}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{approval.to}</Text>
          </View>
          {approval.description && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{approval.description}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>
              {new Date(approval.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Approvals: {approvedCount}/{approval.requiredApprovals}
            </Text>
            {rejectedCount > 0 && (
              <Text style={styles.rejectedCount}>
                {rejectedCount} rejected
              </Text>
            )}
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(progressPercentage, 100)}%` }
              ]} 
            />
          </View>

          <View style={styles.approvalsList}>
            {approval.approvals.map((appr, index) => (
              <View key={index} style={styles.approvalItem}>
                <Text style={styles.approverName}>
                  User {appr.userId.slice(-4)}
                </Text>
                <Text style={[
                  styles.approvalStatus,
                  appr.status === 'approved' && styles.approved,
                  appr.status === 'rejected' && styles.rejected,
                ]}>
                  {appr.status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {approval.canApprove && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleApproval(approval.id, false)}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApproval(approval.id, true)}
            >
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading approvals...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Approvals</Text>
        <Text style={styles.subtitle}>
          {pendingApprovals.length} pending transaction{pendingApprovals.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {pendingApprovals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No pending approvals</Text>
          <Text style={styles.emptySubtitle}>
            All transactions have been processed
          </Text>
        </View>
      ) : (
        <View style={styles.approvalsList}>
          {pendingApprovals.map(approval => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  approvalsList: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  transactionId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  exchangeRate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardContent: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  rejectedCount: {
    fontSize: 12,
    color: '#dc3545',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  approverName: {
    fontSize: 12,
    color: '#666',
  },
  approvalStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#666',
  },
  approved: {
    color: '#28a745',
  },
  rejected: {
    color: '#dc3545',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButtonText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});