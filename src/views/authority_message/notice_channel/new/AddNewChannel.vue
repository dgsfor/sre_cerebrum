<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="渠道名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['name', {rules:[{required: true, message: '请输入渠道名称'}]}]" />
    </a-form-item>
    <a-form-item
      label="渠道类型"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-radio-group v-decorator="['type']">
        <a-radio :value="1">企业微信机器人</a-radio>
        <a-radio :value="2">企业微信应用</a-radio>
        <a-radio :value="3" disabled>其他(待新增)</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="机器人Key"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-show="form.getFieldValue('type') === 1"
    >
      <a-input v-decorator="['robot_key', {rules:[{message: '请输入机器人key'}]}]" />
    </a-form-item>
    <a-form-item
      label="企业ID"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-show="form.getFieldValue('type') === 2"
    >
      <a-input v-decorator="['corp_id', {rules:[{message: '请输入企业ID'}]}]" />
    </a-form-item>
    <a-form-item
      label="企业微信应用秘钥"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-show="form.getFieldValue('type') === 2"
    >
      <a-input v-decorator="['corp_secret', {rules:[{message: '请输入企业微信应用秘钥'}]}]" />
    </a-form-item>
    <a-form-item
      label="企业微信应用ID"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-show="form.getFieldValue('type') === 2"
    >
      <a-input v-decorator="['agent_id', {rules:[{message: '请输入企业微信应用ID'}]}]" />
    </a-form-item>
    <a-form-item
      label="是否公开"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-radio-group v-decorator="['share_type', { initialValue: 1 }]">
        <a-radio :value="1">公开的</a-radio>
        <a-radio :value="2">私有的</a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { createNoticeChannel } from '@/api/apis/authority_message'

const fields = ['name', 'type', 'robot_key', 'corp_id', 'corp_secret', 'agent_id', 'share_type']

export default {
  name: 'AddNewChannel',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      addStatus: false
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  created () {
    window.setInterval(() => {
      if (this.addStatus === true) {
        this.$router.go(0)
      }
    }, 1000)
  },
  methods: {
    onOk () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          if (values.type === 1 && typeof values.robot_key === 'undefined') {
            setTimeout(() => {
            this.$notification.warning({
              message: '创建失败',
              description: '机器人key不能为空'
            })
            }, 1)
            return new Promise(resolve => {
              resolve(false)
            })
          } else if (values.type === 2 && (typeof values.corp_id === 'undefined' || typeof values.corp_secret === 'undefined' || typeof values.agent_id === 'undefined')) {
            setTimeout(() => {
            this.$notification.warning({
              message: '创建失败',
              description: '企业微信应用配置缺失'
            })
            }, 1)
            return new Promise(resolve => {
              resolve(false)
            })
          } else {
            this.CreateNoticeChannelFunc(values)
          }
        }
      })
    },
    onCancel () {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
      })
    },
    /**
     * 创建通知渠道
     */
    async CreateNoticeChannelFunc (params) {
      var postData = {
        'name': params.name,
        'share_type': params.share_type,
        'type': params.type,
        'robot_key': params.robot_key,
        'corp_id': params.corp_id,
        'corp_secret': params.corp_secret,
        'agent_id': params.agent_id
      }
      try {
        const result = await createNoticeChannel(postData)
        if (result.status === 200) {
          setTimeout(() => {
            this.$notification.success({
              message: '创建成功',
              description: result.data.msg
            })
          }, 1000)
          this.addStatus = true
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
