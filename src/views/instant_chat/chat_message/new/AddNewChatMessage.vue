<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="发送内容"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['content', {rules:[{message: '请输入即时消息内容'}]}]" />
    </a-form-item>
    <a-form-item
      label="接收者"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-select v-decorator="['receiver']">
        <a-select-option v-for="(item,i) in userList" :key="i" :value="item.email + '/' + item.user_name">{{ item.user_name }} / {{ item.email }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="是否直接进入房间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-radio-group v-decorator="['entry_room', { initialValue: 1 }]">
        <a-radio :value="1">是</a-radio>
        <a-radio :value="2">否</a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { createChatMessage } from '@/api/apis/instant_chat_message'
import { getUserList } from '@/api/apis/user'

const fields = ['content', 'receiver', 'entry_room']

export default {
  name: 'AddNewChatMessage',
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
      addStatus: false,
      userList: []
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
    // 获取用户列表
    this.GetUserListFunc()
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
        if (!errors) {
          if (typeof values.content === 'undefined' || typeof values.receiver === 'undefined') {
            setTimeout(() => {
            this.$notification.warning({
              message: '创建失败',
              description: '消息内容或者接收者为空'
            })
            }, 1)
            return new Promise(resolve => {
              resolve(false)
            })
          } else {
            console.log(values)
            this.CreateChatMessageFunc(values)
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
     * 创建消息
     */
    async CreateChatMessageFunc (params) {
      var postData = {
        'receiver': params.receiver.split('/')[1],
        'receiver_email': params.receiver.split('/')[0],
        'content': params.content
      }
      try {
        const result = await createChatMessage(postData)
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
    },
    /**
     * 获取用户列表
     */
    async GetUserListFunc () {
      try {
        const result = await getUserList()
        if (result.status === 200) {
          this.userList = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
