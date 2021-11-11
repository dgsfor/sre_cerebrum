import request from '../../utils/request'

// report
export function createReport (params) {
    return request.post('/api/ssopa/v1/report/report', params)
}
export function getReportList () {
    return request.get('/api/ssopa/v1/report/report')
}
export function renderReport (reportId) {
    return request.get(`/api/ssopa/v1/report/report_render/${reportId}`)
}
export function getReport (params) {
    return request.get(`/api/ssopa/v1/report/report/${params}`)
}
export function updateReport (params) {
    return request.put('/api/ssopa/v1/report/report', params)
}
export function reportPreview (reportId, previewHash) {
    return request.get(`/api/ssopa/v1/report/report_preview/${reportId}/${previewHash}`)
}
