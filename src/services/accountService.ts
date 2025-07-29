import { Account, Transaction, ApiResponse } from '@/types';

class AccountService {
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const accounts: Account[] = [
        {
          id: 'acc_usd_1',
          name: 'Business USD Account',
          currency: 'USD',
          balance: 125000.50,
          yieldRate: 4.2,
          type: 'checking',
        },
        {
          id: 'acc_brl_1',
          name: 'Business BRL Account',
          currency: 'BRL',
          balance: 650000.00,
          yieldRate: 8.5,
          type: 'checking',
        },
        {
          id: 'acc_usd_savings',
          name: 'USD Savings',
          currency: 'USD',
          balance: 50000.00,
          yieldRate: 3.8,
          type: 'savings',
        },
      ];

      return { success: true, data: accounts };
    } catch (error) {
      return { success: false, error: 'Failed to fetch accounts' };
    }
  }

  async getRecentTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const transactions: Transaction[] = [
        {
          id: 'tx_1',
          from: 'acc_usd_1',
          to: 'external_address_123',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          type: 'transfer',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          requiredApprovals: 2,
          approvedBy: ['user_123', 'user_456'],
          description: 'Payment to supplier',
        },
        {
          id: 'tx_2',
          from: 'acc_brl_1',
          to: 'acc_usd_1',
          amount: 10000,
          currency: 'BRL',
          status: 'pending',
          type: 'swap',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          requiredApprovals: 2,
          approvedBy: ['user_123'],
          exchangeRate: 5.2,
        },
      ];

      return { success: true, data: transactions.slice(0, limit) };
    } catch (error) {
      return { success: false, error: 'Failed to fetch transactions' };
    }
  }

  async getAccountById(accountId: string): Promise<ApiResponse<Account>> {
    try {
      const accountsResponse = await this.getAccounts();
      if (!accountsResponse.success || !accountsResponse.data) {
        return { success: false, error: 'Failed to fetch accounts' };
      }

      const account = accountsResponse.data.find(acc => acc.id === accountId);
      if (!account) {
        return { success: false, error: 'Account not found' };
      }

      return { success: true, data: account };
    } catch (error) {
      return { success: false, error: 'Failed to fetch account' };
    }
  }
}

export const accountService = new AccountService();