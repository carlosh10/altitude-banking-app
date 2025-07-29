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
import { SwapQuote, Account } from '../../types';
import { tradeService } from '../../services/tradeService';
import { accountService } from '../../services/accountService';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trade Assets</Text>
        <Text style={styles.subtitle}>Swap between USD, BRL, and USDC</Text>
      </View>

      <View style={styles.tradeForm}>
        <View style={styles.currencySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>From</Text>
            {fromAccount && (
              <Text style={styles.balanceText}>
                Balance: {fromAccount.balance.toLocaleString()}
              </Text>
            )}
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
            />
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
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.swapSection}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleSwapCurrencies}
          >
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

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
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {quote && (
          <View style={styles.quoteSection}>
            <View style={styles.quoteHeader}>
              <Text style={styles.quoteTitle}>Quote Details</Text>
              {quoteValidTime > 0 && (
                <Text style={styles.quoteTimer}>
                  Valid for {quoteValidTime}s
                </Text>
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

        <TouchableOpacity
          style={[
            styles.tradeButton,
            (!quote || loading || quoteValidTime <= 0) && styles.tradeButtonDisabled
          ]}
          onPress={handleTrade}
          disabled={!quote || loading || quoteValidTime <= 0}
        >
          <Text style={styles.tradeButtonText}>
            {loading ? 'Loading...' : 'Execute Trade'}
          </Text>
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
            <Text style={styles.modalTitle}>Confirm Trade</Text>
            
            {quote && (
              <View style={styles.confirmationDetails}>
                <Text style={styles.confirmLabel}>You're trading:</Text>
                <Text style={styles.confirmValue}>
                  {parseFloat(fromAmount).toLocaleString()} {fromCurrency}
                </Text>
                
                <Text style={styles.confirmLabel}>You'll receive:</Text>
                <Text style={styles.confirmValue}>
                  {quote.toAmount.toFixed(6)} {toCurrency}
                </Text>
                
                <Text style={styles.confirmLabel}>Exchange rate:</Text>
                <Text style={styles.confirmValue}>
                  1 {fromCurrency} = {quote.rate.toFixed(6)} {toCurrency}
                </Text>

                <Text style={styles.confirmLabel}>Total fees:</Text>
                <Text style={styles.confirmValue}>
                  {(quote.fees.network + quote.fees.platform).toFixed(6)} {fromCurrency}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmTrade}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Processing...' : 'Confirm Trade'}
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
  tradeForm: {
    padding: 20,
  },
  currencySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  amountInputDisabled: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  currencyPicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 120,
  },
  picker: {
    height: 50,
  },
  swapSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  quoteSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  quoteTimer: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  quoteDetails: {
    gap: 8,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteLabel: {
    fontSize: 14,
    color: '#666',
  },
  quoteValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  tradeButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tradeButtonDisabled: {
    opacity: 0.6,
  },
  tradeButtonText: {
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
    marginTop: 12,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 2,
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