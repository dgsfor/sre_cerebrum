<template>
  <a-modal
    :visible="visible"
    title="创建消息"
    okText="创建"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="模板名称">
        <a-input v-model="clickTemplateId" disabled />
      </a-form-item>
      <a-form-item label="消息名称">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入消息名称' }]}
          ]"
          name="name"
          placeholder="给消息取个名字" />
      </a-form-item>
      <a-form-item label="消息类型">
        <a-select v-decorator="['message_type', { initialValue: 'custom' }]">
          <a-select-option value="custom">普通类型消息</a-select-option>
          <a-select-option value="custom_oncall">日常SRE轮值消息</a-select-option>
          <a-select-option value="holidays_oncall">节假日值班消息</a-select-option>
          <a-select-option value="sre_ssopa_message">SRE稳定性运营消息</a-select-option>
          <a-select-option value="fault_message">故障同步消息</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="内容格式">
        <a-select v-decorator="['message_content_type', { initialValue: 'markdown' }]">
          <a-select-option value="markdown">Markdown格式</a-select-option>
          <a-select-option value="text">Text格式</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="通知渠道">
        <a-select v-decorator="['notice_channel_id']" mode="multiple">
          <a-select-option v-for="(item,i) in notice_channel_list" :key="i" :value="item.notice_channel_id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否需要审核">
        <a-select v-decorator="['audit_required', { initialValue: 'true' }]">
          <a-select-option value="true">需要</a-select-option>
          <a-select-option value="false">不需要</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getNoticeChannelList } from '@/api/apis/authority_message'

export default {
    name: 'ModalForm',

    props: {
        visible: Boolean,
        // eslint-disable-next-line vue/require-default-prop
        clickTemplateId: String
    },
    created () {
      this.GetNoticeChannelListFunc()
    },
    data () {
        return {
            form: this.$form.createForm(this),
            notice_channel_list: []
        }
    },

    methods: {
      /**
      * 获取通知渠道列表
      */
      async GetNoticeChannelListFunc () {
        try {
          const result = await getNoticeChannelList()
          if (result.status === 200) {
           this.notice_channel_list = result.data.data
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
}
</script>
