import { USDCBalance } from '../types';

// USDC mint addresses for different networks
export const USDC_MINT_ADDRESSES = {
  mainnet: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  devnet: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  testnet: 'CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp',
};

export const USDC_DECIMALS = 6;

class USDCUtils {
  private mintAddress: string;

  constructor(network: 'mainnet' | 'devnet' | 'testnet' = 'devnet') {
    this.mintAddress = USDC_MINT_ADDRESSES[network];
  }

  /**
   * Convert USDC token amount to USD value
   */
  toUSD(tokenAmount: number): number {
    return tokenAmount / Math.pow(10, USDC_DECIMALS);
  }

  /**
   * Convert USD value to USDC token amount
   */
  fromUSD(usdAmount: number): number {
    return Math.floor(usdAmount * Math.pow(10, USDC_DECIMALS));
  }

  /**
   * Format USDC amount for display
   */
  formatAmount(tokenAmount: number): string {
    const usdValue = this.toUSD(tokenAmount);
    return usdValue.toFixed(2);
  }

  /**
   * Format USDC amount with currency symbol
   */
  formatAmountWithSymbol(tokenAmount: number): string {
    return `$${this.formatAmount(tokenAmount)}`;
  }

  /**
   * Parse user input to USDC token amount
   */
  parseUserInput(input: string): number | null {
    const cleanInput = input.replace(/[^0-9.]/g, '');
    const usdAmount = parseFloat(cleanInput);
    
    if (isNaN(usdAmount) || usdAmount < 0) {
      return null;
    }

    return this.fromUSD(usdAmount);
  }

  /**
   * Validate USDC amount
   */
  isValidAmount(tokenAmount: number): boolean {
    return tokenAmount > 0 && Number.isInteger(tokenAmount);
  }

  /**
   * Get minimum transferable amount (0.01 USD in USDC tokens)
   */
  getMinimumAmount(): number {
    return this.fromUSD(0.01);
  }

  /**
   * Calculate transaction fee estimate
   */
  estimateTransactionFee(): number {
    // Base Solana transaction fee + token account creation if needed
    return 0.002; // 0.002 SOL
  }

  /**
   * Create USDC balance object
   */
  createBalance(tokenAmount: number): USDCBalance {
    return {
      amount: tokenAmount,
      usdValue: this.toUSD(tokenAmount),
      mintAddress: this.mintAddress.toString(),
    };
  }

  /**
   * Convert BRL to USD using exchange rate
   */
  convertBRLToUSD(brlAmount: number, exchangeRate: number): number {
    return brlAmount / exchangeRate;
  }

  /**
   * Convert USD to BRL using exchange rate
   */
  convertUSDToBRL(usdAmount: number, exchangeRate: number): number {
    return usdAmount * exchangeRate;
  }

  /**
   * Calculate slippage for trades
   */
  calculateSlippage(expectedAmount: number, actualAmount: number): number {
    if (expectedAmount === 0) return 0;
    return Math.abs((expectedAmount - actualAmount) / expectedAmount) * 100;
  }

  /**
   * Apply slippage tolerance to amount
   */
  applySlippageTolerance(amount: number, tolerancePercent: number): number {
    const slippageMultiplier = 1 - (tolerancePercent / 100);
    return Math.floor(amount * slippageMultiplier);
  }

  /**
   * Get USDC mint address for current network
   */
  getMintAddress(): string {
    return this.mintAddress;
  }

  /**
   * Validate wallet address format (mock implementation)
   */
  isValidSolanaAddress(address: string): boolean {
    // Basic validation - 32-44 characters, base58-like
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
  }

  /**
   * Generate associated token account address (mock)
   */
  async getAssociatedTokenAccount(walletAddress: string): Promise<string> {
    // Mock implementation - in production would use @solana/spl-token
    return `ata_${walletAddress}_${this.mintAddress}`;
  }
}

// Export singleton instance
export const usdcUtils = new USDCUtils();

// Export utility functions for direct use
export const formatUSDC = (amount: number): string => usdcUtils.formatAmount(amount);
export const formatUSDCWithSymbol = (amount: number): string => usdcUtils.formatAmountWithSymbol(amount);
export const parseUSDCInput = (input: string): number | null => usdcUtils.parseUserInput(input);
export const toUSD = (tokenAmount: number): number => usdcUtils.toUSD(tokenAmount);
export const fromUSD = (usdAmount: number): number => usdcUtils.fromUSD(usdAmount);
export const isValidUSDCAmount = (amount: number): boolean => usdcUtils.isValidAmount(amount);
export const isValidSolanaAddress = (address: string): boolean => usdcUtils.isValidSolanaAddress(address);