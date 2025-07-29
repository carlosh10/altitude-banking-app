import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Account, Transaction } from '../../types';
import { AccountCard } from '../../components/common/AccountCard';
import { YieldChart } from '../../components/charts/YieldChart';
import { TransactionList } from '../../components/common/TransactionList';
import { accountService } from '../../services/accountService';

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
      <View style={styles.centerContainer}>
        <Text>Loading dashboard...</Text>
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
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Your account overview</Text>
      </View>

      <View style={styles.balanceSection}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total USD (USDC)</Text>
          <Text style={styles.balanceAmount}>${totalUSD.toLocaleString()}</Text>
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total BRL</Text>
          <Text style={styles.balanceAmount}>R${totalBRL.toLocaleString()}</Text>
        </View>
      </View>

      {avgYield > 0 && (
        <View style={styles.yieldSection}>
          <Text style={styles.sectionTitle}>Yield Performance</Text>
          <View style={styles.yieldCard}>
            <Text style={styles.yieldLabel}>Average APY</Text>
            <Text style={styles.yieldValue}>{avgYield.toFixed(2)}%</Text>
          </View>
          <YieldChart accounts={accounts} />
        </View>
      )}

      <View style={styles.accountsSection}>
        <Text style={styles.sectionTitle}>Accounts</Text>
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
      </View>

      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <TransactionList transactions={recentTransactions} />
      </View>
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
  balanceSection: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  yieldSection: {
    padding: 20,
    paddingTop: 0,
  },
  yieldCard: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  yieldLabel: {
    fontSize: 14,
    color: '#2d5a2d',
  },
  yieldValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5a2d',
  },
  accountsSection: {
    padding: 20,
    paddingTop: 0,
  },
  transactionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#007bff',
    fontSize: 16,
  },
});