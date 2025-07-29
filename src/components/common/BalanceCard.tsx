import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface BalanceCardProps {
  title: string;
  amount: number;
  currency: 'USD' | 'BRL';
  yield?: number;
  gradient?: string[];
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  currency,
  yield,
  gradient,
}) => {
  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : 'R$';
    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getCurrencyColor = () => {
    return currency === 'USD' ? theme.colors.usd : theme.colors.brl;
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.gradientCard]}
      >
        <View style={styles.header}>
          <Text style={styles.titleGradient}>{title}</Text>
          {yield && (
            <View style={styles.yieldBadgeGradient}>
              <Text style={styles.yieldTextGradient}>
                +{yield.toFixed(1)}% APY
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountGradient}>
            {formatAmount(amount, currency)}
          </Text>
          <Text style={styles.currencyLabelGradient}>{currency}</Text>
        </View>

        {currency === 'USD' && (
          <Text style={styles.usdcLabelGradient}>USDC Stablecoin</Text>
        )}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, styles.whiteCard, theme.shadows.md]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {yield && (
          <View style={[styles.yieldBadge, { backgroundColor: getCurrencyColor() }]}>
            <Text style={styles.yieldText}>+{yield.toFixed(1)}% APY</Text>
          </View>
        )}
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: getCurrencyColor() }]}>
          {formatAmount(amount, currency)}
        </Text>
        <Text style={styles.currencyLabel}>{currency}</Text>
      </View>

      {currency === 'USD' && (
        <Text style={styles.usdcLabel}>USDC Stablecoin</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 140,
  },
  whiteCard: {
    backgroundColor: theme.colors.white,
  },
  gradientCard: {
    // Gradient styles handled by LinearGradient
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray[600],
    flex: 1,
  },
  titleGradient: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  yieldBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  yieldBadgeGradient: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  yieldText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  yieldTextGradient: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  amountContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  amount: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  amountGradient: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  currencyLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    fontWeight: theme.fontWeight.medium,
  },
  currencyLabelGradient: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.fontWeight.medium,
  },
  usdcLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    marginTop: theme.spacing.xs,
  },
  usdcLabelGradient: {
    fontSize: theme.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing.xs,
  },
});