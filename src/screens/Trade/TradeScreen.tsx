import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { SwapQuote, Account } from '../../types';
import { tradeService } from '../../services/tradeService';
import { accountService } from '../../services/accountService';
import { GradientButton } from '../../components/common/GradientButton';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

export const TradeScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('BRL');
  const [fromAmount, setFromAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currencies = [
    { code: 'USD', name: 'USD (USDC)', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'USDC', name: 'USD Coin', symbol: 'USDC' },
  ];

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromCurrency !== toCurrency) {
      getQuote();
    } else {
      setQuote(null);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const loadAccounts = async () => {
    const response = await accountService.getAccounts();
    if (response.success) {
      setAccounts(response.data || []);
    }
  };

  const getQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setLoading(true);
    try {
      const response = await tradeService.getSwapQuote({
        fromCurrency,
        toCurrency,
        amount: parseFloat(fromAmount),
      });

      if (response.success && response.data) {
        setQuote(response.data);
      }
    } catch (error) {
      console.error('Failed to get quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount('');
    setQuote(null);
  };

  const handleTrade = () => {
    if (!quote) {
      Alert.alert('Error', 'Please get a quote first');
      return;
    }

    const fromAccount = accounts.find(acc => 
      acc.currency === fromCurrency || 
      (fromCurrency === 'USDC' && acc.currency === 'USD')
    );

    if (!fromAccount || fromAccount.balance < parseFloat(fromAmount)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTrade = async () => {
    if (!quote) return;

    setLoading(true);
    setShowConfirmation(false);

    try {
      const response = await tradeService.executeSwap({
        fromCurrency,
        toCurrency,
        fromAmount: parseFloat(fromAmount),
        quote,
      });

      if (response.success) {
        Alert.alert(
          'Trade Submitted',
          'Your swap has been submitted for processing. You will be notified once it is completed.',
          [{ text: 'OK', onPress: resetForm }]
        );
      } else {
        Alert.alert('Error', response.error || 'Trade failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Trade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromAmount('');
    setQuote(null);
  };

  const fromAccount = accounts.find(acc => 
    acc.currency === fromCurrency || 
    (fromCurrency === 'USDC' && acc.currency === 'USD')
  );

  const quoteValidTime = quote ? 
    Math.max(0, Math.floor((new Date(quote.validUntil).getTime() - Date.now()) / 1000)) : 0;

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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Floating Header */}
            <View style={styles.header}>
              <View style={styles.headerBlur}>
                <Text style={styles.title}>Trade Assets</Text>
                <Text style={styles.subtitle}>Swap between USD, BRL, and USDC</Text>
              </View>
            </View>

            {/* Floating Trade Form */}
            <View style={styles.tradeFormContainer}>
              <View style={styles.floatingCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.cardGradient}
                >
                  {/* From Currency Section */}
                  <View style={styles.currencySection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionLabel}>From</Text>
                      {fromAccount && (
                        <LinearGradient
                          colors={fromCurrency === 'USD' ? theme.gradients.usd : theme.gradients.brl}
                          style={styles.balanceBadge}
                        >
                          <Text style={styles.balanceText}>
                            Balance: {fromAccount.balance.toLocaleString()}
                          </Text>
                        </LinearGradient>
                      )}
                    </View>
                    
                    <View style={styles.inputRow}>
                      <View style={styles.amountInputWrapper}>
                        <TextInput
                          style={styles.amountInput}
                          placeholder="0.00"
                          placeholderTextColor={theme.colors.gray[400]}
                          value={fromAmount}
                          onChangeText={setFromAmount}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View style={styles.currencyPicker}>
                        <Picker
                          selectedValue={fromCurrency}
                          onValueChange={setFromCurrency}
                          style={styles.picker}
                        >
                          {currencies.map(currency => (
                            <Picker.Item
                              key={currency.code}
                              label={currency.name}
                              value={currency.code}
                              style={styles.pickerItem}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>

                  {/* Swap Button Section */}
                  <View style={styles.swapSection}>
                    <TouchableOpacity
                      style={styles.swapButton}
                      onPress={handleSwapCurrencies}
                    >
                      <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={styles.swapButtonGradient}
                      >
                        <Text style={styles.swapIcon}>⇅</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* To Currency Section */}
                  <View style={styles.currencySection}>
                    <Text style={styles.sectionLabel}>To</Text>
                    
                    <View style={styles.inputRow}>
                      <View style={styles.amountInputDisabled}>
                        <Text style={styles.amountText}>
                          {quote ? quote.toAmount.toFixed(6) : '0.00'}
                        </Text>
                      </View>
                      <View style={styles.currencyPicker}>
                        <Picker
                          selectedValue={toCurrency}
                          onValueChange={setToCurrency}
                          style={styles.picker}
                        >
                          {currencies.map(currency => (
                            <Picker.Item
                              key={currency.code}
                              label={currency.name}
                              value={currency.code}
                              style={styles.pickerItem}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>

                  {/* Quote Details */}
                  {quote && (
                    <View style={styles.quoteSection}>
                      <View style={styles.quoteHeader}>
                        <Text style={styles.quoteTitle}>Quote Details</Text>
                        {quoteValidTime > 0 && (
                          <LinearGradient
                            colors={['#10B981', '#34D399']}
                            style={styles.timerBadge}
                          >
                            <Text style={styles.quoteTimer}>
                              Valid for {quoteValidTime}s
                            </Text>
                          </LinearGradient>
                        )}
                      </View>

                      <View style={styles.quoteDetails}>
                        <View style={styles.quoteRow}>
                          <Text style={styles.quoteLabel}>Exchange Rate:</Text>
                          <Text style={styles.quoteValue}>
                            1 {fromCurrency} = {quote.rate.toFixed(6)} {toCurrency}
                          </Text>
                        </View>

                        <View style={styles.quoteRow}>
                          <Text style={styles.quoteLabel}>Slippage:</Text>
                          <Text style={styles.quoteValue}>{quote.slippage.toFixed(2)}%</Text>
                        </View>

                        <View style={styles.quoteRow}>
                          <Text style={styles.quoteLabel}>Network Fee:</Text>
                          <Text style={styles.quoteValue}>
                            {quote.fees.network.toFixed(6)} {fromCurrency}
                          </Text>
                        </View>

                        <View style={styles.quoteRow}>
                          <Text style={styles.quoteLabel}>Platform Fee:</Text>
                          <Text style={styles.quoteValue}>
                            {quote.fees.platform.toFixed(6)} {fromCurrency}
                          </Text>
                        </View>

                        <View style={[styles.quoteRow, styles.totalRow]}>
                          <Text style={styles.totalLabel}>You'll receive:</Text>
                          <Text style={styles.totalValue}>
                            {quote.toAmount.toFixed(6)} {toCurrency}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Trade Button */}
                  <View style={styles.buttonContainer}>
                    <GradientButton
                      title={loading ? 'Loading...' : 'Execute Trade'}
                      onPress={handleTrade}
                      loading={loading}
                      disabled={!quote || loading || quoteValidTime <= 0}
                      size="lg"
                      variant="primary"
                      style={styles.tradeButton}
                    />
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Confirmation Modal */}
            <Modal
              visible={showConfirmation}
              transparent
              animationType="slide"
              onRequestClose={() => setShowConfirmation(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.floatingCard}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                      style={styles.modalCardGradient}
                    >
                      <Text style={styles.modalTitle}>Confirm Trade</Text>
                      
                      {quote && (
                        <View style={styles.confirmationDetails}>
                          <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>You're trading:</Text>
                            <Text style={styles.confirmValue}>
                              {parseFloat(fromAmount).toLocaleString()} {fromCurrency}
                            </Text>
                          </View>
                          
                          <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>You'll receive:</Text>
                            <Text style={styles.confirmValue}>
                              {quote.toAmount.toFixed(6)} {toCurrency}
                            </Text>
                          </View>
                          
                          <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>Exchange rate:</Text>
                            <Text style={styles.confirmValue}>
                              1 {fromCurrency} = {quote.rate.toFixed(6)} {toCurrency}
                            </Text>
                          </View>

                          <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>Total fees:</Text>
                            <Text style={styles.confirmValue}>
                              {(quote.fees.network + quote.fees.platform).toFixed(6)} {fromCurrency}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.cancelButton]}
                          onPress={() => setShowConfirmation(false)}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <GradientButton
                          title={loading ? 'Processing...' : 'Confirm Trade'}
                          onPress={confirmTrade}
                          loading={loading}
                          variant="primary"
                          style={styles.confirmButtonWrapper}
                        />
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing['2xl'],
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
  tradeFormContainer: {
    paddingHorizontal: theme.spacing.lg,
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
  currencySection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
  },
  balanceBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  balanceText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  amountInputWrapper: {
    flex: 1,
  },
  amountInput: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    textAlign: 'right',
    ...theme.shadows.sm,
  },
  amountInputDisabled: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: theme.spacing.md,
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  amountText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
    textAlign: 'right',
  },
  currencyPicker: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.02)',
    minWidth: 120,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  picker: {
    height: 50,
    color: theme.colors.gray[900],
  },
  pickerItem: {
    color: theme.colors.gray[900],
  },
  swapSection: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  swapButton: {
    // Container for gradient button
  },
  swapButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  swapIcon: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
  },
  quoteSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  quoteTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  timerBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  quoteTimer: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semibold,
  },
  quoteDetails: {
    gap: theme.spacing.sm,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  quoteLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
  },
  quoteValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[900],
    fontWeight: theme.fontWeight.semibold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
  },
  totalValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  tradeButton: {
    // Button styles handled by GradientButton
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCardGradient: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  confirmationDetails: {
    marginBottom: theme.spacing.xl,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  confirmLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.fontWeight.medium,
    flex: 1,
  },
  confirmValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[900],
    flex: 2,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...theme.shadows.sm,
  },
  cancelButton: {
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[700],
  },
  confirmButtonWrapper: {
    flex: 1,
  },
});