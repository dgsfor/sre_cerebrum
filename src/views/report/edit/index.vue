<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" content="编辑运营报告">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <!-- 报告名称 -->
        <a-form-item
          label="报告名称">
          <a-input v-model="name" disabled />
        </a-form-item>
        <!-- 报告内容 -->
        <a-form-item
          label="报告内容">
          <v-md-editor v-model="content" height="500px"></v-md-editor>
        </a-form-item>
        <a-form-item
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getReport, updateReport } from '@/api/apis/report'

export default {
  name: 'EditReport',
  data () {
    return {
      form: this.$form.createForm(this),
      report_id: '',
      name: '',
      content: ''
    }
  },
  mounted: function () {
      this.report_id = this.$route.query.report_id
      this.GetReportFunc(this.report_id)
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.content === '') {
            this.$notification.error({
              message: '异常',
              description: 'markdown内容不能为空！'
            })
          } else {
            this.UpdateReportFunc()
          }
        }
      })
    },
    /**
     * 获取运营报告
     */
    async GetReportFunc (params) {
      try {
        const result = await getReport(params)
        this.name = result.data.data.name
        this.content = result.data.data.content
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 更新运营报告
     */
    async UpdateReportFunc () {
      var updateData = {
        'report_id': this.report_id,
        'content': this.content
      }
      try {
        const result = await updateReport(updateData)
        if (result.status === 200) {
          setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
          }, 500)
          this.$router.push({ path: '/report/list' })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
