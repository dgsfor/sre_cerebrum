import request from '../../utils/request'

// authority message
export function createAuthorityMessage (params) {
    return request.post('/api/ssopa/v1/authority_message/message', params)
}
export function getAuthorityMessageList () {
    return request.get('/api/ssopa/v1/authority_message/message')
}
export function getAuthorityMessage (params) {
    return request.get(`/api/ssopa/v1/authority_message/message/${params}`)
}
export function updateAuthorityMessage (params) {
    return request.put('/api/ssopa/v1/authority_message/message', params)
}
export function authorityMessageSend (messageId, sendType) {
    return request.get(`/api/ssopa/v1/authority_message/message_send/${messageId}/${sendType}`)
}
export function getAuthorityMessageSendHistory (messageId) {
    return request.get(`/api/ssopa/v1/authority_message/message_history/${messageId}`)
}
export function auditAuthorityMessage (messageId, auditStatus) {
    return request.put(`/api/ssopa/v1/authority_message/message_audit/${messageId}/${auditStatus}`)
}
// authority notice channel
export function createNoticeChannel (params) {
    return request.post('/api/ssopa/v1/authority_message/notice_channel', params)
}
export function getNoticeChannelList () {
    return request.get('/api/ssopa/v1/authority_message/notice_channel')
}
