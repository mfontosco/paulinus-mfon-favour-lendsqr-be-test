import WalletService from '../src/services/wallet.service';
import knex from '../src/db/connection';

jest.mock('../src/db/connection', () => {
  const actual = jest.requireActual('../src/db/connection');
  return {
    ...actual,
    transaction: jest.fn(),
  };
});

describe('WalletService', () => {
  let trx: any;
  let trxFn: any;

  beforeEach(() => {
    trx = {
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      rollback: jest.fn(),
      commit: jest.fn(),
    };

    trxFn = jest.fn(() => trx); 

   
    (knex.transaction as jest.Mock).mockImplementation(async (cb?: any) => {
      if (cb && typeof cb === 'function') {
        return cb(trxFn);
      }
      return trxFn;
    });

    jest.clearAllMocks();
  });

  describe('fundWallet', () => {
    it('should fund wallet and insert credit transaction', async () => {
      trxFn.mockReturnValueOnce(trx); // trx('wallets')
      trx.first.mockResolvedValueOnce({
        id: 'wallet123',
        user_id: 'user123',
        balance: 100,
      });

      await WalletService.fundWallet({
        userId: 'user123',
        amount: 50,
        narration: 'Top up test',
      });

      expect(trx.update).toHaveBeenCalledWith({ balance: 150 });
      expect(trx.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'credit',
          amount: 50,
          user_id: 'user123',
          wallet_id: 'wallet123',
        })
      );
    });
  });

  describe('withdrawFromWallet', () => {
    it('should withdraw and insert debit transaction', async () => {
      trxFn.mockReturnValueOnce(trx); // trx('wallets')
      trx.first.mockResolvedValueOnce({
        id: 'wallet456',
        user_id: 'user456',
        balance: 200,
      });

      await WalletService.withdrawFromWallet({
        userId: 'user456',
        amount: 50,
        description: 'Test withdrawal',
      });

      expect(trx.update).toHaveBeenCalledWith({ balance: 150 });
      expect(trx.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'debit',
          amount: 50,
          user_id: 'user456',
          wallet_id: 'wallet456',
        })
      );
    });

    it('should fail withdrawal with insufficient balance', async () => {
      trxFn.mockReturnValueOnce(trx); // trx('wallets')
      trx.first.mockResolvedValueOnce({
        id: 'wallet789',
        user_id: 'user789',
        balance: 30,
      });

      await expect(
        WalletService.withdrawFromWallet({
          userId: 'user789',
          amount: 100,
          description: 'Attempt overdraft',
        })
      ).rejects.toThrow('Insufficient balance');

      expect(trx.rollback).toHaveBeenCalled();
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds and record transactions', async () => {
      trxFn.mockReturnValueOnce(trx).mockReturnValueOnce(trx); 
      trx.first
        .mockResolvedValueOnce({
          id: 'wallet_sender',
          user_id: 'sender_id',
          balance: 100,
        })
        .mockResolvedValueOnce({
          id: 'wallet_recipient',
          user_id: 'recipient_id',
          balance: 50,
        });

      await WalletService.transferFunds({
        senderId: 'sender_id',
        recipientId: 'recipient_id',
        amount: 40,
        narration: 'Transfer test',
      });

      expect(trx.update).toHaveBeenCalledWith({ balance: 60 });
      expect(trx.update).toHaveBeenCalledWith({ balance: 90 }); 
      expect(trx.insert).toHaveBeenCalledTimes(2);
      expect(trx.insert).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'debit', user_id: 'sender_id' })
      );
      expect(trx.insert).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'credit', user_id: 'recipient_id' })
      );
    });

    it('should fail if sender and recipient are the same', async () => {
      await expect(
        WalletService.transferFunds({
          senderId: 'same_user',
          recipientId: 'same_user',
          amount: 50,
          narration: 'Self-transfer test',
        })
      ).rejects.toThrow('Cannot transfer to self');
    });

    it('should fail if sender wallet not found', async () => {
      trxFn.mockReturnValueOnce(trx).mockReturnValueOnce(trx);
      trx.first.mockResolvedValueOnce(null); 

      await expect(
        WalletService.transferFunds({
          senderId: 'missing',
          recipientId: 'recipient_id',
          amount: 100,
          narration: 'Test transfer',
        })
      ).rejects.toThrow('Sender or recipient wallet not found');

      expect(trx.rollback).toHaveBeenCalled();
    });
  });
});
