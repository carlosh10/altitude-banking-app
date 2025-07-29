export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'approver';
  publicKey: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  groupIds?: string[];
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'approve';
  description?: string;
}

export interface ACHInfo {
  routingNumber: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings';
}

export interface WireInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  swiftCode?: string;
  bankAddress?: string;
  intermediaryBank?: {
    name: string;
    swiftCode: string;
    accountNumber: string;
  };
}

export interface PIXInfo {
  keys: {
    email?: string;
    phone?: string;
    cpf?: string;
    cnpj?: string;
    randomKey?: string;
  };
  bankCode: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  accountType: 'corrente' | 'poupanca';
}

export interface Account {
  id: string;
  name: string;
  currency: 'USD' | 'BRL';
  balance: number;
  yieldRate?: number;
  type: 'checking' | 'savings' | 'trading';
  achInfo?: ACHInfo;
  wireInfo?: WireInfo;
  pixInfo?: PIXInfo;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: 'USD' | 'BRL';
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

export interface WireInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  swiftCode?: string;
  bankAddress?: string;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  wireInfo?: WireInfo;
  usdcAddress?: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type NavigationParamList = {
  Login: undefined;
  Dashboard: undefined;
  Payments: undefined;
  Approvals: undefined;
  Trade: undefined;
  Companies: undefined;
};

export interface ConfigurationSettings {
  defaultAccountProfile?: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    transactions: boolean;
    approvals: boolean;
    lowBalance: boolean;
  };
  security: {
    biometric: boolean;
    sessionTimeout: number;
  };
  display: {
    currency: 'USD' | 'BRL';
    showTestAccounts: boolean;
  };
}

export interface AccountProfile {
  id: string;
  name: string;
  description?: string;
  accounts: Account[];
  users: User[];
  multisigConfig: MultisigConfig;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}