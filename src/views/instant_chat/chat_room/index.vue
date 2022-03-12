<template>
  <page-header-wrapper>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="房间">

      <a-list
        class="comment-list"
        item-layout="horizontal"
        :data-source="InstantChatMessageData"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-comment :author="item.sender" avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
            <p slot="content">
              {{ item.content }}
            </p>
            <a-tooltip slot="created_at" :title="item.created_at">
              <span>{{ item.created_at }}</span>
            </a-tooltip>
          </a-comment>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getInstantChatMessageList } from '@/api/apis/instant_chat_message'

const InstantChatMessageData = []

export default {
  name: 'ChatMessageRoomDetail',
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
