<template>
  <page-header-wrapper>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="对话列表">

      <div slot="extra">
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="add">快速创建即时消息</a-button>
      </div>

      <a-list size="large" :pagination="pagination">
        <a-list-item :key="index" v-for="(item, index) in InstantChatMessageData">
          <a-list-item-meta :description="item.chat_message_id">
            <a slot="title">房间ID: {{ item.room_id }}</a>
          </a-list-item-meta>
          <a-list-item-meta :description="item.sender">
            <a slot="title">发送者</a>
          </a-list-item-meta>
          <a-list-item-meta :description="item.receiver">
            <a slot="title">接收者</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.status === 'Unread'" description="未读">
            <a slot="title">状态</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.status === 'Read'" description="已读">
            <a slot="title">状态</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.type === 'InSiteMessage'" description="站内消息">
            <a slot="title">类型</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.type === 'PrivateMessage'" description="私信消息">
            <a slot="title">类型</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleView(item)">查看</a>
          </div>
          <div slot="actions">
            <a v-show="item.type === 'PrivateMessage'" @click="gotoRoomPage(item)">进入房间</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>创建时间</span>
              <p>{{ item.created_at }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import AddNewChatMessage from './new/AddNewChatMessage'
import { getInstantChatMessageList } from '@/api/apis/instant_chat_message'
import { Modal } from 'ant-design-vue'

const InstantChatMessageData = []

export default {
  name: 'ChatMessageList',
  components: {
  },
  data () {
    return {
      InstantChatMessageData,
      status: 'all',
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 3
      }
    }
  },
  created () {
    this.GetInstantChatMessageListFunc()
  },
  methods: {
    add () {
      this.$dialog(AddNewChatMessage,
        {
          record: {},
          on: {
            ok () {
              console.log('ok 回调')
              this.GetInstantChatMessageListFunc()
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '创建消息',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    /**
     * 查看消息详情
     */
    handleView (record) {
      Modal.success({
        title: '消息详情如下：',
        content: (
            <ul>
                <li>ID: {record.chat_message_id}</li>
                <li>房间：{record.room_id}</li>
                <li>发送人：{record.sender}</li>
                <li>发送人邮箱：{record.sender_email}</li>
                <li>接受者：{record.receiver}</li>
                <li>接收者邮箱：{record.receiver_email}</li>
                <li>内容：{record.content}</li>
                <li v-show={record.type === 'InSiteMessage'}>类型: 站内消息</li>
                <li v-show={record.type === 'PrivateMessage'}>类型: 私信</li>
                <li v-show={record.status === 'Unread'}>状态: 未读</li>
                <li v-show={record.status === 'Read'}>状态: 已读</li>
                <li>创建时间：{record.created_at}</li>
            </ul>
        ),
        okText: '确认',

        onOk: () => {
        },

        onCancel () {
          console.log('关闭')
        }
      })
    },
    gotoRoomPage (item) {
      this.$router.push({
        name: 'chat_message_room_detail',
        query: {
          room_id: item.room_id
        }
      })
    },
    /**
     * 获取私信列表
     */
    async GetInstantChatMessageListFunc () {
      try {
        const result = await getInstantChatMessageList()
        if (result.status === 200) {
          this.InstantChatMessageData = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
