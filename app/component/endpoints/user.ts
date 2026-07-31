import { request } from "../Apis";

export const User_urls = {

    login(data: any) {
        return request({
            endpoint: "user/login",
            method: "POST",
            data,
            type: 'JSON',
        });
    },
    updatePassword(data: any) {
        return request({
            endpoint: "user/update-password",
            method: "POST",
            data,
            type: 'JSON',
            auth: 'true'
        });
    },
    uploadKyc(data: FormData) {
        return request({
            endpoint: "user/upload-kyc",
            method: "POST",
            data,
            type: 'FILE',
            auth: 'true'
        });
    },


    register(data: any) {
        return request({
            endpoint: "user/signup",
            method: "POST",
            data,
            type: 'JSON',
        });
    },

    profile() {
        return request({
            endpoint: "user/profile",
            auth: 'true',
            method: "GET"
        });
    }

}