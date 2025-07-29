export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'approver';
  publicKey: string;
}

export interface Account {
  id: string;
  name: string;
  currency: 'USD' | 'BRL';
  balance: number;
  yield?: number;
  type: 'checking' | 'savings' | 'trading';
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: 'USD' | 'BRL' | 'USDC';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  type: 'transfer' | 'swap' | 'deposit' | 'withdrawal';
  createdAt: string;
  approvedBy?: string[];
  requiredApprovals: number;
  description?: string;
  exchangeRate?: number;
}

export interface Approval {
  id: string;
  transactionId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  comments?: string;
}

export interface SwapQuote {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  slippage: number;
  validUntil: string;
  fees: {
    network: number;
    platform: number;
  };
}

export interface MultisigConfig {
  threshold: number;
  members: string[];
  squadId: string;
}

export interface USDCBalance {
  amount: number;
  usdValue: number;
  mintAddress: string;
}

export type NavigationParamList = {
  Login: undefined;
  Dashboard: undefined;
  Payments: undefined;
  Approvals: undefined;
  Trade: undefined;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}