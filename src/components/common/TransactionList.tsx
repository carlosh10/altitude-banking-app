import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return '#28a745';
        case 'pending': return '#ffc107';
        case 'rejected': return '#dc3545';
        default: return '#666';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'transfer': return '↗';
        case 'swap': return '⇄';
        case 'deposit': return '↓';
        case 'withdrawal': return '↑';
        default: return '•';
      }
    };

    const formatAmount = (amount: number, currency: string) => {
      const symbol = currency === 'USD' ? '$' : currency === 'BRL' ? 'R$' : '';
      return `${symbol}${amount.toLocaleString()}`;
    };

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Text style={styles.iconText}>{getTypeIcon(transaction.type)}</Text>
        </View>
        
        <View style={styles.transactionContent}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionType}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Text>
            <Text style={styles.transactionAmount}>
              {formatAmount(transaction.amount, transaction.currency)}
            </Text>
          </View>
          
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTo} numberOfLines={1}>
              To: {transaction.to}
            </Text>
            <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
          
          {transaction.description && (
            <Text style={styles.transactionDescription} numberOfLines={1}>
              {transaction.description}
            </Text>
          )}
          
          <Text style={styles.transactionDate}>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    color: '#666',
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTo: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});