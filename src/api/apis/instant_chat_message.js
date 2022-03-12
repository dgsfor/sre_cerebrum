import request from '../../utils/request'

// instant chat message
export function createChatMessage (params) {
    return request.post('/api/ssopa/v1/instant_chat_message/chat_message', params)
}
export function getInstantChatMessageList () {
    return request.get('/api/ssopa/v1/instant_chat_message/chat_message')
}
