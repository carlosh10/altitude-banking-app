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
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { Account, Transaction } from '../../types';
import { paymentsService } from '../../services/paymentsService';
import { accountService } from '../../services/accountService';
import { GradientButton } from '../../components/common/GradientButton';
import { GradientCard } from '../../components/common/GradientCard';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

export const PaymentsScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [description, setDescription] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
    loadExchangeRate();
  }, [currency]);

  const loadAccounts = async () => {
    const response = await accountService.getAccounts();
    if (response.success) {
      setAccounts(response.data || []);
    }
  };

  const loadExchangeRate = async () => {
    if (currency === 'USD') {
      const rate = await paymentsService.getExchangeRate('USD', 'BRL');
      setExchangeRate(rate);
    } else {
      const rate = await paymentsService.getExchangeRate('BRL', 'USD');
      setExchangeRate(rate);
    }
  };

  const handleSendPayment = async () => {
    if (!fromAccount || !toAddress || !amount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const selectedAccount = accounts.find(acc => acc.id === fromAccount);
    if (!selectedAccount || selectedAccount.balance < numAmount) {
      Alert.alert('Insufficient Balance', 'Your account balance is insufficient for this transaction');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      const paymentData = {
        fromAccount,
        toAddress,
        amount: parseFloat(amount),
        currency,
        description,
        exchangeRate,
      };

      const response = await paymentsService.createPayment(paymentData);
      
      if (response.success) {
        Alert.alert(
          'Payment Initiated',
          'Your payment has been submitted for approval. You will be notified once it is processed.',
          [{ text: 'OK', onPress: resetForm }]
        );
      } else {
        Alert.alert('Payment Failed', response.error || 'Unable to process payment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromAccount('');
    setToAddress('');
    setAmount('');
    setDescription('');
  };

  const selectedAccount = accounts.find(acc => acc.id === fromAccount);
  const convertedAmount = exchangeRate && parseFloat(amount) 
    ? parseFloat(amount) * exchangeRate 
    : null;

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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Floating Header */}
              <View style={styles.header}>
                <View style={styles.headerBlur}>
                  <Text style={styles.title}>Send Payment</Text>
                  <Text style={styles.subtitle}>
                    Transfer BRL or USD (USDC) globally
                  </Text>
                </View>
              </View>

              {/* Floating Form Card */}
              <View style={styles.formContainer}>
                <View style={styles.floatingCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.cardGradient}
                  >
                    {/* From Account Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>From Account</Text>
                      <View style={styles.inputContainer}>
                        <View style={styles.pickerWrapper}>
                          <Picker
                            selectedValue={fromAccount}
                            onValueChange={setFromAccount}
                            style={styles.picker}
                          >
                            <Picker.Item 
                              label="Select your account" 
                              value="" 
                              style={styles.pickerPlaceholder}
                            />
                            {accounts.map(account => (
                              <Picker.Item
                                key={account.id}
                                label={`${account.name} - ${account.currency} ${account.balance.toLocaleString()}`}
                                value={account.id}
                                style={styles.pickerItem}
                              />
                            ))}
                          </Picker>
                        </View>
                        {selectedAccount && (
                          <View style={styles.balanceInfo}>
                            <LinearGradient
                              colors={currency === 'USD' ? theme.gradients.usd : theme.gradients.brl}
                              style={styles.balanceBadge}
                            >
                              <Text style={styles.balanceText}>
                                Available: {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
                              </Text>
                            </LinearGradient>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* To Address Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Recipient</Text>
                      <View style={styles.inputContainer}>
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === 'toAddress' && styles.inputWrapperFocused,
                          ]}
                        >
                          <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter recipient address or account ID"
                            placeholderTextColor={theme.colors.gray[400]}
                            value={toAddress}
                            onChangeText={setToAddress}
                            onFocus={() => setFocusedField('toAddress')}
                            onBlur={() => setFocusedField(null)}
                            multiline
                            numberOfLines={2}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Amount and Currency Section */}
                    <View style={styles.row}>
                      <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Amount</Text>
                        <View style={styles.inputContainer}>
                          <View
                            style={[
                              styles.inputWrapper,
                              focusedField === 'amount' && styles.inputWrapperFocused,
                            ]}
                          >
                            <TextInput
                              style={[styles.input, styles.amountInput]}
                              placeholder="0.00"
                              placeholderTextColor={theme.colors.gray[400]}
                              value={amount}
                              onChangeText={setAmount}
                              onFocus={() => setFocusedField('amount')}
                              onBlur={() => setFocusedField(null)}
                              keyboardType="decimal-pad"
                            />
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Currency</Text>
                        <View style={styles.inputContainer}>
                          <View style={styles.pickerWrapper}>
                            <Picker
                              selectedValue={currency}
                              onValueChange={setCurrency}
                              style={styles.picker}
                            >
                              <Picker.Item label="USD (USDC)" value="USD" />
                              <Picker.Item label="BRL" value="BRL" />
                            </Picker>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Exchange Rate Info */}
                    {exchangeRate && parseFloat(amount) > 0 && (
                      <View style={styles.section}>
                        <View style={styles.exchangeCard}>
                          <LinearGradient
                            colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']}
                            style={styles.exchangeGradient}
                          >
                            <View style={styles.exchangeHeader}>
                              <Text style={styles.exchangeTitle}>💱 Exchange Rate</Text>
                              <Text style={styles.exchangeRate}>
                                1 {currency} = {exchangeRate.toFixed(4)} {currency === 'USD' ? 'BRL' : 'USD'}
                              </Text>
                            </View>
                            {convertedAmount && (
                              <Text style={styles.convertedAmount}>
                                ≈ {convertedAmount.toFixed(2)} {currency === 'USD' ? 'BRL' : 'USD'}
                              </Text>
                            )}
                          </LinearGradient>
                        </View>
                      </View>
                    )}

                    {/* Description Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Description (Optional)</Text>
                      <View style={styles.inputContainer}>
                        <View
                          style={[
                            styles.inputWrapper,
                            focusedField === 'description' && styles.inputWrapperFocused,
                          ]}
                        >
                          <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add a note for this payment"
                            placeholderTextColor={theme.colors.gray[400]}
                            value={description}
                            onChangeText={setDescription}
                            onFocus={() => setFocusedField('description')}
                            onBlur={() => setFocusedField(null)}
                            multiline
                            numberOfLines={3}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Send Button */}
                    <View style={styles.buttonContainer}>
                      <GradientButton
                        title="Send Payment"
                        onPress={handleSendPayment}
                        loading={loading}
                        disabled={!fromAccount || !toAddress || !amount}
                        size="lg"
                        variant="primary"
                        style={styles.sendButton}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

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
                    <Text style={styles.modalTitle}>Confirm Payment</Text>
                    
                    <View style={styles.confirmationDetails}>
                      <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>Amount</Text>
                        <Text style={styles.confirmValue}>
                          {currency} {parseFloat(amount || '0').toLocaleString()}
                        </Text>
                      </View>
                      
                      {convertedAmount && (
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>Converted</Text>
                          <Text style={styles.confirmValue}>
                            {currency === 'USD' ? 'BRL' : 'USD'} {convertedAmount.toFixed(2)}
                          </Text>
                        </View>
                      )}
                      
                      <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>To</Text>
                        <Text style={[styles.confirmValue, styles.addressText]} numberOfLines={2}>
                          {toAddress}
                        </Text>
                      </View>
                      
                      {description && (
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmLabel}>Description</Text>
                          <Text style={styles.confirmValue}>{description}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setShowConfirmation(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <GradientButton
                        title={loading ? 'Processing...' : 'Confirm & Send'}
                        onPress={confirmPayment}
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  formContainer: {
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray[800],
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    // Container for input wrappers
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  halfSection: {
    flex: 1,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.02)',
    ...theme.shadows.sm,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...theme.shadows.md,
  },
  input: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.gray[900],
    backgroundColor: 'transparent',
  },
  amountInput: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'right',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  picker: {
    height: 50,
    color: theme.colors.gray[900],
  },
  pickerPlaceholder: {
    color: theme.colors.gray[400],
  },
  pickerItem: {
    color: theme.colors.gray[900],
  },
  balanceInfo: {
    marginTop: theme.spacing.sm,
  },
  balanceBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    ...theme.shadows.sm,
  },
  balanceText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.white,
  },
  exchangeCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  exchangeGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  exchangeTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  exchangeRate: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  convertedAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  sendButton: {
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
  addressText: {
    fontSize: theme.fontSize.sm,
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