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
            auth: 'true'
        });
    }

}