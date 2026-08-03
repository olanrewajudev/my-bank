import { request } from "../Apis";

export const Admin_urls = {

    getAllUser() {
        return request({
            endpoint: "user/all",
            method: "GET",
            auth:'true'
        });
    },

    getSingleUser(id: string) {
        return request({
            endpoint: `user/single/${id}`,
            method: "GET",
            auth:'true'
        });
    },

    updateKycStatus(data: any) {
        return request({
            endpoint: "user/update-kyc",
            auth: 'true',
            method: "PUT",
            data,
            type: 'JSON'
        });
    },
    deleteKyc(data: any) {
        return request({
            endpoint: "user/delete-kyc",
            auth: 'true',
            method: "POST",
            data,
            type: 'JSON'
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