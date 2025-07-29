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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Account, Transaction } from '../../types';
import { paymentsService } from '../../services/paymentsService';
import { accountService } from '../../services/accountService';

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
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const selectedAccount = accounts.find(acc => acc.id === fromAccount);
    if (!selectedAccount || selectedAccount.balance < numAmount) {
      Alert.alert('Error', 'Insufficient balance');
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
        Alert.alert('Error', response.error || 'Payment failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Payment</Text>
        <Text style={styles.subtitle}>Transfer BRL or USD (USDC)</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>From Account</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fromAccount}
              onValueChange={setFromAccount}
              style={styles.picker}
            >
              <Picker.Item label="Select account" value="" />
              {accounts.map(account => (
                <Picker.Item
                  key={account.id}
                  label={`${account.name} - ${account.currency} ${account.balance.toLocaleString()}`}
                  value={account.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>To Address/Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient address or account"
            value={toAddress}
            onChangeText={setToAddress}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.halfSection}>
            <Text style={styles.label}>Currency</Text>
            <View style={styles.pickerContainer}>
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

        {exchangeRate && parseFloat(amount) > 0 && (
          <View style={styles.exchangeInfo}>
            <Text style={styles.exchangeLabel}>
              Exchange Rate: 1 {currency} = {exchangeRate.toFixed(4)} {currency === 'USD' ? 'BRL' : 'USD'}
            </Text>
            {convertedAmount && (
              <Text style={styles.convertedAmount}>
                ≈ {convertedAmount.toFixed(2)} {currency === 'USD' ? 'BRL' : 'USD'}
              </Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Payment description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {selectedAccount && (
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceText}>
              Available: {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, (!fromAccount || !toAddress || !amount) && styles.buttonDisabled]}
          onPress={handleSendPayment}
          disabled={!fromAccount || !toAddress || !amount || loading}
        >
          <Text style={styles.buttonText}>Send Payment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showConfirmation}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            
            <View style={styles.confirmationDetails}>
              <Text style={styles.confirmLabel}>Amount:</Text>
              <Text style={styles.confirmValue}>{currency} {parseFloat(amount).toLocaleString()}</Text>
              
              {convertedAmount && (
                <>
                  <Text style={styles.confirmLabel}>Converted:</Text>
                  <Text style={styles.confirmValue}>
                    {currency === 'USD' ? 'BRL' : 'USD'} {convertedAmount.toFixed(2)}
                  </Text>
                </>
              )}
              
              <Text style={styles.confirmLabel}>To:</Text>
              <Text style={styles.confirmValue}>{toAddress}</Text>
              
              {description && (
                <>
                  <Text style={styles.confirmLabel}>Description:</Text>
                  <Text style={styles.confirmValue}>{description}</Text>
                </>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmPayment}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Processing...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  exchangeInfo: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  exchangeLabel: {
    fontSize: 14,
    color: '#0066cc',
  },
  convertedAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
    marginTop: 4,
  },
  balanceInfo: {
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationDetails: {
    marginBottom: 24,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});