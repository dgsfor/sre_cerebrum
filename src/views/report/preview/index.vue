<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-descriptions title="报告详情" bordered size="small">
      <a-descriptions-item label="报告ID">
        {{ reportData.report_id }}
      </a-descriptions-item>
      <a-descriptions-item label="报告名称">
        {{ reportData.name }}
      </a-descriptions-item>
      <a-descriptions-item label="报告类型">
        {{ reportData.report_type }}
      </a-descriptions-item>
      <a-descriptions-item label="开始时间">
        {{ reportData.start_time }}
      </a-descriptions-item>
      <a-descriptions-item label="结束时间" :span="2">
        {{ reportData.end_time }}
      </a-descriptions-item>
      <a-descriptions-item label="创建者" :span="3">
        {{ reportData.creator }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <v-md-preview :text="markdownContent"></v-md-preview>
  </a-card>
</template>

<script>
import { reportPreview } from '@/api/apis/report'

export default {
  name: 'ReportPreview',
  data () {
    return {
      form: this.$form.createForm(this),
      reportData: [],
      markdownContent: ''
    }
  },
  mounted: function () {
      this.report_id = this.$route.query.report_id
      this.preview_hash = this.$route.query.preview_hash
      this.GetReportFunc()
  },
  methods: {
    /**
     * 获取运营报告
     */
    async GetReportFunc () {
      try {
        const result = await reportPreview(this.report_id, this.preview_hash)
        if (result.status === 200) {
            this.reportData = result.data.data
            this.markdownContent = result.data.data.content
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
