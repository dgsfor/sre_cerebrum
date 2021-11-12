import request from '../../utils/request'

// report template
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

export function deleteReportTemplate (params) {
    return request.delete(`/api/ssopa/v1/report_template/template/${params}`)
}

export function updateReportTemplateStatus (templateId, status) {
    return request.put(`/api/ssopa/v1/report_template/template/${templateId}/${status}`)
}
// report template var
export function createReportTemplateVar (params) {
    return request.post('/api/ssopa/v1/report_template/var', params)
}

export function getReportTemplateVarList () {
    return request.get('/api/ssopa/v1/report_template/var')
}

export function deleteReportTemplateVar (templateId, varName) {
    return request.delete(`/api/ssopa/v1/report_template/var/${templateId}/${varName}`)
}

export function getRenderProgress (renderId, resourceId, resourceType) {
    return request.get(`/api/ssopa/v1/report_template/var/render/${renderId}/${resourceId}/${resourceType}`)
}

export function mergeRenderRecordToContent (params) {
    return request.put('/api/ssopa/v1/report_template/var/merge', params)
}

// report template slot
export function createReportTemplateSlot (params) {
    return request.post('/api/ssopa/v1/report_template/slot', params)
}

export function getReportTemplateSlotList () {
    return request.get('/api/ssopa/v1/report_template/slot')
}

export function deleteReportTemplateSlot (templateId, slotName) {
    return request.delete(`/api/ssopa/v1/report_template/slot/${templateId}/${slotName}`)
}
