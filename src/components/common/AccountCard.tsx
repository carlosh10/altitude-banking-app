import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Account } from '../../types';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const formatBalance = (balance: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : 'R$';
    return `${symbol}${balance.toLocaleString()}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountType}>
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)} • {account.currency}
          </Text>
        </View>
        {account.yieldRate && (
          <View style={styles.yieldBadge}>
            <Text style={styles.yieldText}>{account.yieldRate.toFixed(1)}% APY</Text>
          </View>
        )}
      </View>
      
      <View style={styles.balanceSection}>
        <Text style={styles.balance}>
          {formatBalance(account.balance, account.currency)}
        </Text>
        {account.currency === 'USD' && (
          <Text style={styles.usdcNote}>USDC Stablecoin</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  accountType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  yieldBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yieldText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d5a2d',
  },
  balanceSection: {
    alignItems: 'flex-start',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  usdcNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});