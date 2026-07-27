import Cookies from 'js-cookie'
export const BaseUrl = import.meta.env.VITE_API_URL 

export const CookieName = 'UserToken'

export const GenerateIdempotencyKey = () => crypto.randomUUID()

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    endpoint: string;
    method?: Method;
    data?: any;
    type?: string;
    auth?: string;
    idpKey?: string;
}

export const request = async ({ endpoint, method = "GET", data, type, auth, idpKey }: RequestOptions) => {
    const token = Cookies.get(CookieName)
    const headers: Record<string, string> = {}

    if (type === 'JSON') {
        headers["Content-type"] = 'application/json';
    }

    if (auth && token) {
        headers.authorization = `Bearer ${token}`
    }

    if (auth && method !== "GET") {
        headers["idp-key"] = idpKey || GenerateIdempotencyKey();
    }

    const response = await fetch(`${BaseUrl}/${endpoint}`,
        {
            method,
            headers,
            body: method === "GET" ? undefined : type === "FILE" ? data : JSON.stringify(data)
        }
    );

    const text = await response.text()

    let result: any = {};
    if (text.length > 0) {
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(`Invalid response from server (status ${response.status})`);
        }
    }

    if (response.status === 401) {
        Cookies.remove(CookieName);
        window.location.href = "/login";
        return {
            data: result,
            status: response.status
        }
    }

    if (!response.ok) {
        throw new Error(result.message || result.msg || 'Request Failed')
    }

    return {
        data: result,
        status: response.status
    }
}

export const Posturl = (endpoint: string, data: any, type: "JSON" | "FILE" = "JSON") => request({
    endpoint, data, type, method: "POST"
})

export const AuthPosturl = (endpoint: string, data: any, type: "JSON" | "FILE" = "JSON", idpKey?: string) => request({
    endpoint, data, type, idpKey, auth: 'true', method: "POST"
})

export const Geturl = (endpoint: string) => request({
    endpoint
})

export const AuthGeturl = (endpoint: string, idpKey?: string) => request({
    endpoint, idpKey, auth: 'true'
})

export const Put = (endpoint: string, data: any, type: "JSON" | "FILE" = "JSON") => request({
    endpoint, data, type, method: "PUT", auth: "true"
})

export const Patch = (endpoint: string, data: any, type: "JSON" | "FILE" = "JSON") => request({
    endpoint, data, type, method: "PATCH", auth: "true"
})

export const Delete = (endpoint: string, data: any,) => request({
    endpoint, data, method: "DELETE", auth: 'true'
})