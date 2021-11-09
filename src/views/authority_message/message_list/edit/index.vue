<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" content="编辑权威消息">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <!-- 消息名称 -->
        <a-form-item
          label="消息名称">
          <a-input v-model="name" disabled />
        </a-form-item>
        <!-- 消息内容 -->
        <a-form-item
          label="消息内容">
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
import { getAuthorityMessage, updateAuthorityMessage } from '@/api/apis/authority_message'

export default {
  name: 'EditAuthorityMessage',
  data () {
    return {
      form: this.$form.createForm(this),
      message_id: '',
      name: '',
      content: ''
    }
  },
  mounted: function () {
      this.message_id = this.$route.query.message_id
      this.GetAuthorityMessageFunc(this.message_id)
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
            this.UpdateAuthorityMessageFunc()
          }
        }
      })
    },
    /**
     * 创建运营模板
     */
    async GetAuthorityMessageFunc (params) {
      try {
        const result = await getAuthorityMessage(params)
        if (result.status === 200) {
          this.name = result.data.data.name
          this.content = result.data.data.content
        }
      } catch (err) {
        setTimeout(() => {
            this.$notification.error({
              message: '错误',
              description: '获取权威消息详情失败'
            })
        }, 0)
      }
    },
    /**
     * 更新运营模板
     */
    async UpdateAuthorityMessageFunc () {
      var updateData = {
        'message_id': this.message_id,
        'content': this.content
      }
      try {
        const result = await updateAuthorityMessage(updateData)
        if (result.status === 200) {
          this.$router.push({ path: '/authority_message/list' })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
