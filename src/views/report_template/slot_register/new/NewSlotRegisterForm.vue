<template>
  <a-modal
    :visible="visible"
    title="新增插槽注册"
    okText="创建"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="模板">
        <a-select v-decorator="['template_id']" @change="handleReportTemplateChange">
          <a-select-option v-for="(item,i) in reportTemplateListData" :key="i" :value="item.template_id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="插槽名称">
        <a-select v-decorator="['slot_name',{rules: [{ required: true}]}]">
          <a-select-option v-for="(item,i) in reportTemplateSlotListData" :key="i" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="插槽别名">
        <a-input
          v-decorator="[
            'slot_name_alias',
            {rules: [{ required: true, message: '请输入插槽别名' }]}
          ]"
          name="slot_name_alias"
          placeholder="给插槽取一个好识别的名字"/>
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
            template_id: '',
            template_id_tmp: '',
            reportTemplateListData: [],
            reportTemplateSlotListData: []
        }
    },

    methods: {
      handleReportTemplateChange (value) {
        for (const item in this.reportTemplateListData) {
          if (this.reportTemplateListData[item].template_id === value) {
            this.reportTemplateSlotListData = this.reportTemplateListData[item].slot_list.split(',')
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
