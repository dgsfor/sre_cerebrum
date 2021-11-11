<template>
  <a-modal
    :visible="visible"
    title="创建报告"
    okText="创建"
    @cancel="() => { $emit('cancel') }"
    @ok="onCreate"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="模板ID">
        <a-input v-model="clickTemplateId" disabled />
      </a-form-item>
      <a-form-item label="报告名称">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入报告名称' }]}
          ]"
          name="name"
          placeholder="给报告取个名字" />
      </a-form-item>
      <a-form-item label="报告类型">
        <a-select v-decorator="['report_type', { initialValue: 'daily' }]">
          <a-select-option value="hourly">小时报</a-select-option>
          <a-select-option value="daily">日报</a-select-option>
          <a-select-option value="weekly">周报</a-select-option>
          <a-select-option value="monthly">月报</a-select-option>
          <a-select-option value="yearly" disabled>年报</a-select-option>
          <a-select-option value="inspection">巡检报</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间范围">
        <a-range-picker
          v-decorator="['time_range']"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          @ok="onOk"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

export default {
    name: 'ModalForm',

    props: {
        visible: Boolean,
        // eslint-disable-next-line vue/require-default-prop
        clickTemplateId: String
    },
    created () {
    },
    data () {
        return {
            form: this.$form.createForm(this),
            time_range: []
        }
    },
    methods: {
      onCreate () {
        this.$emit('create', this.time_range)
      },
      onChange () {
        this.time_range = arguments[1]
      },
      onOk () {
      }
    }
}
</script>
