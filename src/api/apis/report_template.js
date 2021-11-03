import request from '../../utils/request'

export function createReportTemplate (params) {
    return request.post('/api/ssopa/v1/report_template/template', params)
}
export function getReportTemplateList () {
    return request.get('/api/ssopa/v1/report_template/template')
}

export function getReportTemplate (params) {
    return request.get(`/api/ssopa/v1/report_template/template/${params}`)
}

export function updateReportTemplate (params) {
    return request.put('/api/ssopa/v1/report_template/template', params)
}
