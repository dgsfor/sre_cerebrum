<template>
  <a-modal
    :visible="visible"
    title="新增变量注册"
    okText="创建"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="变量类型">
        <a-select v-decorator="['var_type', { initialValue: 'inner_var' }]" @change="handleVarTypeChange">
          <a-select-option value="inner_var">内置变量</a-select-option>
          <a-select-option value="custom_var">自定义变量</a-select-option>
          <a-select-option value="img_var">图片变量</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="变量名称">
        <a-input
          v-decorator="[
            'var_name',
            {rules: [{ required: true, message: '请输入变量名称' }]}
          ]"
          name="var_name"
          placeholder="给变量取个名字"
          :disabled="inner_show" />
      </a-form-item>
      <a-form-item label="模板">
        <a-select v-decorator="['template_id']" :disabled="else_show" @change="handleReportTemplateChange">
          <a-select-option v-for="(item,i) in reportTemplateListData" :key="i" :value="item.template_id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="变量">
        <a-select v-decorator="['var_name']" :disabled="else_show" @change="handleReportTemplateChange">
          <a-select-option v-for="(item,i) in reportTemplateVarListData" :key="i" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="获取地址">
        <a-input
          v-decorator="[
            'var_url',
            {rules: [{ required: true, message: '请输入url' }]}
          ]"
          name="var_url"
          placeholder="请输入url"/>
      </a-form-item>
      <a-form-item label="Header头">
        <a-input
          v-decorator="['var_header']"
          name="var_header"
          placeholder="token:xxxxxx,多个header用逗号分隔 token1:xxxxx1,token2:xxxxx2"/>
      </a-form-item>
      <a-form-item label="获取字段">
        <a-input
          v-decorator="[
            'var_result_field',
            {rules: [{ required: true, message: '请输入返回数据需要获取的字段' }]}
          ]"
          name="var_result_field"
          placeholder="请输入返回数据需要获取的字段"/>
      </a-form-item>
      <a-form-item label="变量说明">
        <a-input
          v-decorator="[
            'var_desc',
            {rules: [{ required: true, message: '请输入变量描述' }]}
          ]"
          name="var_desc"
          placeholder="请输入变量描述"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getReportTemplateList } from '@/api/apis/report_template'

export default {
    name: 'ModalForm',

    props: {
        visible: Boolean
    },
    created () {
      this.GetReportTemplateListFunc()
    },
    data () {
        return {
            form: this.$form.createForm(this),
            inner_show: false,
            else_show: true,
            template_id: '',
            template_id_tmp: '',
            reportTemplateListData: [],
            reportTemplateVarListData: []
        }
    },

    methods: {
      handleVarTypeChange (value) {
        if (value === 'inner_var') {
            this.inner_show = false
            this.else_show = true
            this.template_id = ''
        } else if (value === 'custom_var' || value === 'img_var') {
            this.inner_show = true
            this.else_show = false
            this.template_id = this.template_id_tmp
        }
      },
      handleReportTemplateChange (value) {
        for (const item in this.reportTemplateListData) {
          if (this.reportTemplateListData[item].template_id === value) {
            this.reportTemplateVarListData = this.reportTemplateListData[item].var_list.split(',')
            this.template_id = this.reportTemplateListData[item].template_id
            this.template_id_tmp = this.reportTemplateListData[item].template_id
          }
        }
      },
      /**
      * 获取运营模板列表
      */
      async GetReportTemplateListFunc () {
        try {
          const result = await getReportTemplateList()
          if (result.status === 200) {
           this.reportTemplateListData = result.data.data
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
}
</script>
