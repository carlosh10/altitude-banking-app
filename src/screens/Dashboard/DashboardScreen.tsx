import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Account, Transaction } from '../../types';
import { BalanceCard } from '../../components/common/BalanceCard';
import { GradientCard } from '../../components/common/GradientCard';
import { theme } from '../../theme';
import { accountService } from '../../services/accountService';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [accountsResponse, transactionsResponse] = await Promise.all([
        accountService.getAccounts(),
        accountService.getRecentTransactions(5),
      ]);

      if (accountsResponse.success) {
        setAccounts(accountsResponse.data || []);
      }
      if (transactionsResponse.success) {
        setRecentTransactions(transactionsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalUSD = accounts
    .filter(acc => acc.currency === 'USD')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalBRL = accounts
    .filter(acc => acc.currency === 'BRL')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const avgYield = accounts
    .filter(acc => acc.yieldRate)
    .reduce((sum, acc, _, arr) => sum + (acc.yieldRate || 0) / arr.length, 0);

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.colors.gray[50], theme.colors.white]}
        style={styles.centerContainer}
      >
        <Text style={styles.loadingText}>Loading your portfolio...</Text>
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
          locations={[0, 0.3, 1]}
          style={styles.backgroundGradient}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="rgba(255,255,255,0.8)"
              />
            }
          >
            {/* Floating Header */}
            <View style={styles.header}>
              <View style={styles.headerBlur}>
                <View style={styles.headerContent}>
                  <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>Good morning</Text>
                    <Text style={styles.userName}>Carlos</Text>
                  </View>
                  
                  <View style={styles.totalPortfolio}>
                    <Text style={styles.portfolioLabel}>Total Portfolio</Text>
                    <Text style={styles.portfolioAmount}>
                      ${(totalUSD + (totalBRL / 5.2)).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    {avgYield > 0 && (
                      <View style={styles.yieldContainer}>
                        <Text style={styles.portfolioYield}>
                          +{avgYield.toFixed(1)}% avg yield
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.content}>
              {/* Floating Balance Cards */}
              <View style={styles.balanceSection}>
                <View style={styles.balanceRow}>
                  <View style={styles.balanceCardContainer}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <BalanceCard
                          title="USD Balance"
                          amount={totalUSD}
                          currency="USD"
                          yieldRate={accounts.find(acc => acc.currency === 'USD')?.yieldRate}
                        />
                      </LinearGradient>
                    </View>
                  </View>
                  <View style={styles.balanceCardContainer}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <BalanceCard
                          title="BRL Balance"
                          amount={totalBRL}
                          currency="BRL"
                          yieldRate={accounts.find(acc => acc.currency === 'BRL')?.yieldRate}
                        />
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </View>

              {/* Floating Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                  <TouchableOpacity style={styles.quickActionCard}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.quickActionContent}>
                          <View style={styles.quickActionIconContainer}>
                            <LinearGradient
                              colors={['#6366F1', '#8B5CF6']}
                              style={styles.quickActionIcon}
                            >
                              <Text style={styles.quickActionEmoji}>💸</Text>
                            </LinearGradient>
                          </View>
                          <Text style={styles.quickActionLabel}>Send Money</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickActionCard}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.quickActionContent}>
                          <View style={styles.quickActionIconContainer}>
                            <LinearGradient
                              colors={['#10B981', '#34D399']}
                              style={styles.quickActionIcon}
                            >
                              <Text style={styles.quickActionEmoji}>✅</Text>
                            </LinearGradient>
                          </View>
                          <Text style={styles.quickActionLabel}>Approvals</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickActionCard}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.quickActionContent}>
                          <View style={styles.quickActionIconContainer}>
                            <LinearGradient
                              colors={['#F59E0B', '#FBBF24']}
                              style={styles.quickActionIcon}
                            >
                              <Text style={styles.quickActionEmoji}>🔄</Text>
                            </LinearGradient>
                          </View>
                          <Text style={styles.quickActionLabel}>Trade</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickActionCard}>
                    <View style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.quickActionContent}>
                          <View style={styles.quickActionIconContainer}>
                            <LinearGradient
                              colors={['#1F2937', '#374151']}
                              style={styles.quickActionIcon}
                            >
                              <Text style={styles.quickActionEmoji}>📊</Text>
                            </LinearGradient>
                          </View>
                          <Text style={styles.quickActionLabel}>Analytics</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recent Activity */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllButton}>View All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    {recentTransactions.length === 0 ? (
                      <View style={styles.emptyTransactions}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>No recent activity</Text>
                        <Text style={styles.emptySubtitle}>
                          Your transactions will appear here
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.transactionsList}>
                        {recentTransactions.map((transaction, index) => (
                          <View
                            key={transaction.id}
                            style={[
                              styles.transactionItem,
                              index < recentTransactions.length - 1 && styles.transactionBorder,
                            ]}
                          >
                            <View style={styles.transactionIcon}>
                              <LinearGradient
                                colors={
                                  transaction.type === 'transfer' ? ['#6366F1', '#8B5CF6'] :
                                  transaction.type === 'swap' ? ['#F59E0B', '#FBBF24'] :
                                  transaction.type === 'deposit' ? ['#10B981', '#34D399'] :
                                  ['#EF4444', '#F87171']
                                }
                                style={styles.transactionIconGradient}
                              >
                                <Text style={styles.transactionEmoji}>
                                  {transaction.type === 'transfer' ? '💸' : 
                                   transaction.type === 'swap' ? '🔄' : 
                                   transaction.type === 'deposit' ? '⬇️' : '⬆️'}
                                </Text>
                              </LinearGradient>
                            </View>
                            
                            <View style={styles.transactionDetails}>
                              <Text style={styles.transactionTitle}>
                                {transaction.type === 'transfer' ? 'Transfer' :
                                 transaction.type === 'swap' ? 'Currency Swap' :
                                 transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                              </Text>
                              <Text style={styles.transactionSubtitle}>
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </Text>
                            </View>
                            
                            <View style={styles.transactionAmount}>
                              <Text style={[
                                styles.transactionValue,
                                { 
                                  color: transaction.currency === 'USD' 
                                    ? theme.colors.usd 
                                    : theme.colors.brl 
                                }
                              ]}>
                                {transaction.currency === 'USD' ? '$' : 'R$'}
                                {transaction.amount.toLocaleString()}
                              </Text>
                              <View style={[
                                styles.statusBadge,
                                { 
                                  backgroundColor: 
                                    transaction.status === 'completed' ? theme.colors.success :
                                    transaction.status === 'pending' ? theme.colors.warning :
                                    theme.colors.error
                                }
                              ]}>
                                <Text style={styles.statusText}>
                                  {transaction.status}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </LinearGradient>
                </View>
              </View>

              {/* Your Accounts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Accounts</Text>
                <View style={styles.accountsList}>
                  {accounts.map(account => (
                    <View key={account.id} style={styles.floatingCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.accountCard}>
                          <View style={styles.accountHeader}>
                            <View style={styles.accountInfo}>
                              <Text style={styles.accountName}>{account.name}</Text>
                              <Text style={styles.accountType}>
                                {account.type} • {account.currency}
                              </Text>
                            </View>
                            {account.yieldRate && (
                              <LinearGradient
                                colors={account.currency === 'USD' ? ['#22C55E', '#16A34A'] : ['#F59E0B', '#D97706']}
                                style={styles.accountYield}
                              >
                                <Text style={styles.accountYieldText}>
                                  {account.yieldRate.toFixed(1)}% APY
                                </Text>
                              </LinearGradient>
                            )}
                          </View>
                          <Text style={[
                            styles.accountBalance,
                            { 
                              color: account.currency === 'USD' 
                                ? theme.colors.usd 
                                : theme.colors.brl 
                            }
                          ]}>
                            {account.currency === 'USD' ? '$' : 'R$'}
                            {account.balance.toLocaleString()}
                          </Text>
                        </View>
                      </LinearGradient>
                    </View>
                  ))}
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
    marginTop: theme.spacing.md,
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
    marginBottom: -theme.spacing.lg,
  },
  headerBlur: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.xl,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  greetingSection: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
  totalPortfolio: {
    alignItems: 'flex-start',
  },
  portfolioLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  portfolioAmount: {
    fontSize: theme.fontSize['4xl'],
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  yieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  portfolioYield: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
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
  balanceSection: {
    marginBottom: theme.spacing.xl,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  balanceCardContainer: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  viewAllButton: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: theme.fontWeight.semibold,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  quickActionIconContainer: {
    marginBottom: theme.spacing.md,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  quickActionEmoji: {
    fontSize: theme.fontSize.xl,
  },
  quickActionLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[700],
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'center',
  },
  transactionsList: {
    paddingVertical: theme.spacing.sm,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: theme.fontSize['4xl'],
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  transactionIcon: {
    marginRight: theme.spacing.md,
  },
  transactionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  transactionEmoji: {
    fontSize: theme.fontSize.lg,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing.xs,
  },
  transactionSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  accountsList: {
    gap: theme.spacing.md,
  },
  accountCard: {
    // Container for account content
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
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
  accountType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textTransform: 'capitalize',
  },
  accountYield: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  accountYieldText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  accountBalance: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
  },
});