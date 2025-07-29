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
    .filter(acc => acc.yield)
    .reduce((sum, acc, _, arr) => sum + (acc.yield || 0) / arr.length, 0);

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
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.userName}>Carlos</Text>
              
              <View style={styles.totalPortfolio}>
                <Text style={styles.portfolioLabel}>Total Portfolio</Text>
                <Text style={styles.portfolioAmount}>
                  ${(totalUSD + (totalBRL / 5.2)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
                {avgYield > 0 && (
                  <Text style={styles.portfolioYield}>
                    +{avgYield.toFixed(1)}% avg yield
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            {/* Balance Cards */}
            <View style={styles.balanceSection}>
              <View style={styles.balanceRow}>
                <View style={styles.balanceCardContainer}>
                  <BalanceCard
                    title="USD Balance"
                    amount={totalUSD}
                    currency="USD"
                    yield={accounts.find(acc => acc.currency === 'USD')?.yield}
                    gradient={theme.colors.gradients.success}
                  />
                </View>
                <View style={styles.balanceCardContainer}>
                  <BalanceCard
                    title="BRL Balance"
                    amount={totalBRL}
                    currency="BRL"
                    yield={accounts.find(acc => acc.currency === 'BRL')?.yield}
                    gradient={theme.colors.gradients.warning}
                  />
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction}>
                  <LinearGradient
                    colors={theme.colors.gradients.primary}
                    style={styles.quickActionGradient}
                  >
                    <Text style={styles.quickActionIcon}>💸</Text>
                  </LinearGradient>
                  <Text style={styles.quickActionLabel}>Send Money</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <LinearGradient
                    colors={theme.colors.gradients.success}
                    style={styles.quickActionGradient}
                  >
                    <Text style={styles.quickActionIcon}>✅</Text>
                  </LinearGradient>
                  <Text style={styles.quickActionLabel}>Approvals</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <LinearGradient
                    colors={theme.colors.gradients.warning}
                    style={styles.quickActionGradient}
                  >
                    <Text style={styles.quickActionIcon}>🔄</Text>
                  </LinearGradient>
                  <Text style={styles.quickActionLabel}>Trade</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <LinearGradient
                    colors={theme.colors.gradients.dark}
                    style={styles.quickActionGradient}
                  >
                    <Text style={styles.quickActionIcon}>📊</Text>
                  </LinearGradient>
                  <Text style={styles.quickActionLabel}>Analytics</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Transactions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllButton}>View All</Text>
                </TouchableOpacity>
              </View>

              <GradientCard shadow="lg">
                {recentTransactions.length === 0 ? (
                  <View style={styles.emptyTransactions}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyTitle}>No recent activity</Text>
                    <Text style={styles.emptySubtitle}>
                      Your transactions will appear here
                    </Text>
                  </View>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <View
                      key={transaction.id}
                      style={[
                        styles.transactionItem,
                        index < recentTransactions.length - 1 && styles.transactionBorder,
                      ]}
                    >
                      <View style={styles.transactionIcon}>
                        <Text style={styles.transactionEmoji}>
                          {transaction.type === 'transfer' ? '💸' : 
                           transaction.type === 'swap' ? '🔄' : 
                           transaction.type === 'deposit' ? '⬇️' : '⬆️'}
                        </Text>
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
                  ))
                )}
              </GradientCard>
            </View>

            {/* Accounts Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Accounts</Text>
              {accounts.map(account => (
                <GradientCard key={account.id} shadow="md" style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <View>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountType}>
                        {account.type} • {account.currency}
                      </Text>
                    </View>
                    {account.yield && (
                      <View style={styles.accountYield}>
                        <Text style={styles.accountYieldText}>
                          {account.yield.toFixed(1)}% APY
                        </Text>
                      </View>
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
                </GradientCard>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.fontWeight.medium,
  },
  userName: {
    fontSize: theme.fontSize['3xl'],
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.lg,
  },
  totalPortfolio: {
    alignItems: 'flex-start',
  },
  portfolioLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.fontWeight.medium,
  },
  portfolioAmount: {
    fontSize: theme.fontSize['4xl'],
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    marginVertical: theme.spacing.xs,
  },
  portfolioYield: {
    fontSize: theme.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
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
    color: theme.colors.gray[900],
  },
  viewAllButton: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  quickActionIcon: {
    fontSize: theme.fontSize['2xl'],
  },
  quickActionLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
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
    borderBottomColor: theme.colors.gray[100],
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionEmoji: {
    fontSize: theme.fontSize.xl,
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
    color: theme.colors.gray[600],
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
  accountCard: {
    marginBottom: theme.spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.success,
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