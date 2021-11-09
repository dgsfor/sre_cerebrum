<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" content="编辑运营模板">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <!-- 模板名称 -->
        <a-form-item
          label="模板名称">
          <a-input v-model="name" disabled />
        </a-form-item>
        <!-- 模板内容 -->
        <a-form-item
          label="模板内容">
          <v-md-editor v-model="content" height="500px"></v-md-editor>
        </a-form-item>
        <!-- 变量列表 -->
        <a-form-item
          label="变量列表">
          <a-select v-model="varlist" mode="tags" style="width: 100%" @change="handleVarListChange"></a-select>
        </a-form-item>
        <!-- 插槽列表 -->
        <a-form-item
          label="插槽列表">
          <a-select v-model="slotlist" mode="tags" style="width: 100%" @change="handleSlotListChange"></a-select>
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
import { getReportTemplate, updateReportTemplate } from '@/api/apis/report_template'

export default {
  name: 'EditReportTemplate',
  data () {
    return {
      form: this.$form.createForm(this),
      template_id: '',
      name: '',
      content: '',
      varlist: [],
      slotlist: []
    }
  },
  mounted: function () {
      this.template_id = this.$route.query.template_id
      this.GetReportTemplateFunc(this.template_id)
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
            this.UpdateReportTemplateFunc()
          }
        }
      })
    },
    /**
    * 变量和插槽触发函数
    */
    handleVarListChange (value) {
      this.varlist = value
    },
    handleSlotListChange (value) {
      this.slotlist = value
    },
    /**
     * 创建运营模板
     */
    async GetReportTemplateFunc (params) {
      try {
        const result = await getReportTemplate(params)
        this.name = result.data.data.name
        this.content = result.data.data.content
        this.varlist = result.data.data.var_list.split(',')
        this.slotlist = result.data.data.slot_list.split(',')
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 更新运营模板
     */
    async UpdateReportTemplateFunc () {
      var updateData = {
        'template_id': this.template_id,
        'content': this.content,
        'var_list': this.varlist.join(','),
        'slot_list': this.slotlist.join(',')
      }
      try {
        const result = await updateReportTemplate(updateData)
        if (result.status === 200) {
          this.reportTemplateListData = result.data.data
          setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
          }, 500)
          this.$router.push({ path: '/report_template/list' })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
