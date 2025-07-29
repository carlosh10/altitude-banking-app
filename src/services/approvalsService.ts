import { Transaction, Approval, ApiResponse } from '@/types';

interface PendingApproval extends Transaction {
  approvals: Approval[];
  canApprove: boolean;
}

class ApprovalsService {
  async getPendingApprovals(): Promise<ApiResponse<PendingApproval[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const pendingApprovals: PendingApproval[] = [
        {
          id: 'tx_pending_1',
          from: 'acc_usd_1',
          to: 'vendor_wallet_123',
          amount: 7500,
          currency: 'USD',
          status: 'pending',
          type: 'transfer',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          requiredApprovals: 3,
          approvedBy: ['user_123'],
          description: 'Software license payment',
          approvals: [
            {
              id: 'approval_1',
              transactionId: 'tx_pending_1',
              userId: 'user_123',
              status: 'approved',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              comments: 'Approved for software purchase',
            },
            {
              id: 'approval_2',
              transactionId: 'tx_pending_1',
              userId: 'user_456',
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'approval_3',
              transactionId: 'tx_pending_1',
              userId: 'user_789',
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
          ],
          canApprove: true,
        },
        {
          id: 'tx_pending_2',
          from: 'acc_brl_1',
          to: 'contractor_pix_key',
          amount: 25000,
          currency: 'BRL',
          status: 'pending',
          type: 'transfer',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          requiredApprovals: 2,
          approvedBy: [],
          description: 'Monthly contractor payment',
          approvals: [
            {
              id: 'approval_4',
              transactionId: 'tx_pending_2',
              userId: 'user_123',
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'approval_5',
              transactionId: 'tx_pending_2',
              userId: 'user_456',
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
          ],
          canApprove: true,
        },
        {
          id: 'tx_pending_3',
          from: 'acc_usd_1',
          to: 'acc_brl_1',
          amount: 10000,
          currency: 'USD',
          status: 'pending',
          type: 'swap',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          requiredApprovals: 2,
          approvedBy: ['user_456'],
          exchangeRate: 5.15,
          description: 'USD to BRL conversion',
          approvals: [
            {
              id: 'approval_6',
              transactionId: 'tx_pending_3',
              userId: 'user_456',
              status: 'approved',
              timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
              comments: 'Good exchange rate',
            },
            {
              id: 'approval_7',
              transactionId: 'tx_pending_3',
              userId: 'user_789',
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
          ],
          canApprove: true,
        },
      ];

      return { success: true, data: pendingApprovals };
    } catch (error) {
      return { success: false, error: 'Failed to fetch pending approvals' };
    }
  }

  async submitApproval(
    transactionId: string, 
    approved: boolean, 
    comments?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock current user ID
      const currentUserId = 'user_current';

      const approval: Approval = {
        id: 'approval_' + Date.now(),
        transactionId,
        userId: currentUserId,
        status: approved ? 'approved' : 'rejected',
        timestamp: new Date().toISOString(),
        comments,
      };

      // In production, this would:
      // 1. Submit approval to backend
      // 2. Update multisig transaction via Squads SDK
      // 3. Check if threshold is met and auto-execute if needed

      console.log('Approval submitted:', approval);

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to submit approval' };
    }
  }

  async getApprovalHistory(): Promise<ApiResponse<Approval[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const approvals: Approval[] = [
        {
          id: 'approval_hist_1',
          transactionId: 'tx_completed_1',
          userId: 'user_123',
          status: 'approved',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          comments: 'Approved vendor payment',
        },
        {
          id: 'approval_hist_2',
          transactionId: 'tx_completed_1',
          userId: 'user_456',
          status: 'approved',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'approval_hist_3',
          transactionId: 'tx_rejected_1',
          userId: 'user_789',
          status: 'rejected',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          comments: 'Insufficient documentation',
        },
      ];

      return { success: true, data: approvals };
    } catch (error) {
      return { success: false, error: 'Failed to fetch approval history' };
    }
  }

  async getTransactionDetails(transactionId: string): Promise<ApiResponse<PendingApproval>> {
    try {
      const approvalsResponse = await this.getPendingApprovals();
      
      if (!approvalsResponse.success || !approvalsResponse.data) {
        return { success: false, error: 'Failed to fetch transaction details' };
      }

      const transaction = approvalsResponse.data.find(tx => tx.id === transactionId);
      
      if (!transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      return { success: true, data: transaction };
    } catch (error) {
      return { success: false, error: 'Failed to fetch transaction details' };
    }
  }
}

export const approvalsService = new ApprovalsService();