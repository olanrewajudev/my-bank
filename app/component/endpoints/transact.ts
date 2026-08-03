import { request } from "../Apis";

export const transact_urls = {
    getAllTransact() {
        return request({
            endpoint: "transactions/all",
            method: "GET",
            auth:'true'
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
   
}