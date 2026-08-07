

import { request } from "../Apis";

export const transact_urls = {
  getAllTransact() {
    return request({
      endpoint: "transactions/all-admin",
      method: "GET",
      auth: 'true'
    });
  },

  getAllUserTransact() {
    return request({
      endpoint: "transactions/all",
      method: "GET",
      auth: 'true'
    });
  },

  getSingleTransact(id: string) {
    return request({
      endpoint: `transactions/transaction/${id}`,
      method: 'GET',
      auth: 'true',
    });
  },

  topup(data: any) {
    return request({
      endpoint: "transactions/create-balance",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },

  // POST /bank-withdrawal - user submits a withdrawal request
  bankWithdrawal(data: any) {
    return request({
      endpoint: "transactions/bank-withdrawal",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },

  // POST /update-balance - admin updates a user's balance
  updateBalance(data: any) {
    return request({
      endpoint: "transactions/update-balance",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },

  // GET /all-withdrawals - admin views all withdrawals
  getAllWithdrawals() {
    return request({
      endpoint: "transactions/all-withdrawals",
      method: "GET",
      auth: 'true'
    });
  },

  // GET /withdraw/:withid - admin views a single withdrawal
  getSingleWithdrawal(withid: string) {
    return request({
      endpoint: `transactions/withdraw/${withid}`,
      method: "GET",
      auth: 'true'
    });
  },

  // PUT /create-transaction - admin creates a direct transaction
  createDirectTransaction(data: any) {
    return request({
      endpoint: "transactions/create-transaction",
      auth: 'true',
      method: "PUT",
      data,
      type: 'JSON'
    });
  },

  // PUT /update-transaction-date - admin updates a transaction's date
  updateTransactionDate(data: any) {
    return request({
      endpoint: "transactions/update-transaction-date",
      auth: 'true',
      method: "PUT",
      data,
      type: 'JSON'
    });
  },

  // POST /confirm-withdrawal - admin confirms a withdrawal
  confirmWithdrawal(data: any) {
    return request({
      endpoint: "transactions/confirm-withdrawal",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },

  // POST /decline-withdrawal - admin declines a withdrawal
  declineWithdrawal(data: any) {
    return request({
      endpoint: "transactions/decline-withdrawal",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },
  sendSingleMail(data: any) {
    return request({
      endpoint: "transactions/single-mail",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },
  sendBroadcastMail(data: any) {
    return request({
      endpoint: "transactions/broadcast-mail",
      auth: 'true',
      method: "POST",
      data,
      type: 'JSON'
    });
  },
}