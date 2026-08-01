import { request } from '../Apis'

export const Card_urls = {
    create(data: {
        number: string
        cvv: string
        expire: string
    }) {
        return request({
            endpoint: 'card/card',
            method: 'POST',
            data,
            type: 'JSON',
            auth: 'true',
        })
    },

    getAll() {
        return request({
            endpoint: 'card/cards',
            method: 'GET',
            auth: 'true',
        })
    },

    getSingle(id: string) {
        return request({
            endpoint: `card/card/${id}`,
            method: 'GET',
            auth: 'true',
        })
    },

    update(
        id: string,
        data: {
            number?: string
            cvv?: string
            expire?: string
        }
    ) {
        return request({
            endpoint: `card/card/${id}`,
            method: 'PUT',
            data,
            type: 'JSON',
            auth: 'true',
        })
    },

    delete(id: string) {
        return request({
            endpoint: `card/card/${id}`,
            method: 'DELETE',
            auth: 'true',
        })
    },
}
