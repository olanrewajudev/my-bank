import { request } from "../Apis";

export const Admin_urls = {

    getAllUser() {
        return request({
            endpoint: "admin/all",
            method: "GET",
            auth:'true'
        });
    },

    getSingleUser() {
        return request({
            endpoint: "user/single",
            method: "GET",
            auth:'true'
        });
    },

    updateKycStatus(data: any) {
        return request({
            endpoint: "user/update-kyc",
            auth: 'true',
            method: "POST",
            data,
            type: 'JSON'
        });
    },
    deleteKyc(data: any) {
        return request({
            endpoint: "user/delete-kyc",
            auth: 'true',
            method: "GET"
        });
    },
    login(data: any) {
        return request({
            endpoint: "user/login",
            method: "POST",
            data,
            type: 'JSON'

        });
    },
    allDeposit() {
        return request({
            endpoint: "transaction/user-deposits",
            auth: 'true',
            method: "GET"
        });
    },
    allTransaction() {
        return request({
            endpoint: "transaction/all-transaction",
            auth: 'true',
            method: "GET"
        });
    },
    allWithdrawal() {
        return request({
            endpoint: "transaction/all-withdrawal",
            auth: 'true',
            method: "GET"
        });
    },
    adminDashboard() {
        return request({
            endpoint: "user/admin-dashboard",
            auth: 'true',
            method: "GET"
        });
    },
}