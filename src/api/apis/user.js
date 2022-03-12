import request from '../../utils/request'

export function login (params) {
    return request.post('/api/ssopa/v1/oauth/login', params)
}

export function register (params) {
    return request.post('/api/ssopa/v1/oauth/register', params)
}

export function logout () {
    return request.get('/api/ssopa/v1/oauth/logout')
}

export function getUserInfo () {
    return request.get('/api/ssopa/v1/oauth/userinfo')
}

export function getUserList () {
    return request.get('/api/ssopa/v1/oauth/user_list')
}
