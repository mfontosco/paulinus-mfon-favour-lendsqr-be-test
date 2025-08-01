export interface FundWalletDTO {
  userId: string;
  amount: number;
  narration?: string;
}
export interface TransferDTO {
  senderId: string;
  recipientId: string;
  amount: number;
  narration?: string;
}
 