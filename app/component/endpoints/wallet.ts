import { request } from "../Apis";

export const Wallet_urls = {

    getAllWallet() {
        return request({
            endpoint: "wallet/all-admin-wallets",
            method: "GET",
            auth: 'true'
        });
    },
    getAllUserWallet() {
        return request({
            endpoint: "wallet/all-user-wallets",
            method: "GET",
            auth: 'true'
        });
    },
    getSingleWallet() {
        return request({
            endpoint: "wallet/admin-wallet",
            method: "GET",
            auth: 'true'
        });
    },
    addWallet(data: any) {
        return request({
            endpoint: "wallet/create-admin-wallet",
            method: "POST",
            data,
            type: 'FILE',
            auth: 'true'
        });
    },
    updateWallet(data: any) {
        return request({
            endpoint: `wallet/update-admin-wallet`,
            method: "PUT",
            data,
            type: 'FILE',
            auth: 'true'
        });
    },
    deleteWallet(id: number) {
        return request({
            endpoint: "wallet/admin-wallet",
            method: "DELETE",
            data: { id },
            type: 'JSON',
            auth: 'true'
        });
    },

}