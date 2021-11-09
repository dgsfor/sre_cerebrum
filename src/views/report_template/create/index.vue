<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" content="创建一个运营模板">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="模板名称"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入模板名称' }]}
            ]"
            name="name"
            placeholder="给模板取个名字" />
        </a-form-item>
        <a-form-item
          label="模板类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="true"
        >
          <a-select v-decorator="['type', { initialValue: 'authoritative_temp' }]">
            <a-select-option value="open_temp" disabled>开放模板</a-select-option>
            <a-select-option value="cron_temp" disabled>周期模板</a-select-option>
            <a-select-option value="authoritative_temp">权威消息模板</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="状态"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="true"
        >
          <a-select v-decorator="['status', { initialValue: 'enable' }]">
            <a-select-option value="enable">可用</a-select-option>
            <a-select-option value="disable">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">创建</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { createReportTemplate } from '@/api/apis/report_template'

export default {
  name: 'CreateReportTemplate',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.CreateReportTemplateFunc(values)
        }
      })
    },
    /**
     * 创建运营模板
     */
    async CreateReportTemplateFunc (params) {
      var postData = {
        'name': params.name,
        'status': params.status,
        'type': params.type
      }
      try {
        const result = await createReportTemplate(postData)
        if (result.status === 200) {
          setTimeout(() => {
            this.$notification.success({
              message: '创建成功',
              description: result.data.msg
            })
        }, 1000)
        this.$router.push({ path: '/report_template/list' })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
