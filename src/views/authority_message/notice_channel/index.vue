<template>
  <page-header-wrapper>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="通知渠道列表">

      <div slot="extra">
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="add">添加消息渠道</a-button>
      </div>

      <a-list size="large" :pagination="pagination">
        <a-list-item :key="index" v-for="(item, index) in NoticeChannelData">
          <a-list-item-meta :description="item.notice_channel_id">
            <a-avatar v-if="item.type === 1" slot="avatar" size="large" shape="square" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2016%2F01%2F05%2FFlFvMnbQuLa3fE1tIsadwmsSwM9n.jpeg%3FimageView2%2F2%2Fw%2F580%2Fh%2F580%2Fq%2F75%2Fformat%2Fjpeg&refer=http%3A%2F%2Fimg.yzcdn.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638699835&t=ee91d62dea2a47a35e989aa4f4533e9e"/>
            <a-avatar v-if="item.type === 2" slot="avatar" size="large" shape="square" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01bac4554bafe5000001bf7247b2f6.jpg%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638699942&t=1e71d5162a32338b2315497666d23080"/>
            <a slot="title">{{ item.name }}</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.type === 1" description="企业微信机器人">
            <a slot="title">类型</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.type === 2" description="企业微信应用">
            <a slot="title">类型</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.share_type === 1" description="公开的">
            <a slot="title">状态</a>
          </a-list-item-meta>
          <a-list-item-meta v-if="item.share_type === 2" description="私有的">
            <a slot="title">状态</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleView(item)">查看</a>
          </div>
          <div slot="actions">
            <a @click="edit(item)">快速发送</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>创建人</span>
              <p>{{ item.creator }}</p>
            </div>
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
import AddNewChannel from './new/AddNewChannel'
import { getNoticeChannelList } from '@/api/apis/authority_message'
import { Modal } from 'ant-design-vue'

const NoticeChannelData = []

export default {
  name: 'NoticeChannelList',
  components: {
  },
  data () {
    return {
      NoticeChannelData,
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
    this.GetNoticeChannelListFunc()
  },
  methods: {
    add () {
      this.$dialog(AddNewChannel,
        // component props
        {
          record: {},
          on: {
            ok () {
              console.log('ok 回调')
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
          title: '新增渠道',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    /**
     * 查看通知渠道详情
     */
    handleView (record) {
      Modal.success({
        title: '渠道详情如下：',
        content: (
            <ul>
                <li>ID：{record.notice_channel_id}</li>
                <li>名称：{record.name}</li>
                <li v-show={record.type === 1}>类型：企业微信机器人</li>
                <li v-show={record.type === 2}>类型：企业微信应用</li>
                <li v-show={record.share_type === 1}>状态：公开的</li>
                <li v-show={record.share_type === 2}>状态：私有的</li>
                <li>机器人key：{record.robot_key}</li>
                <li>企业ID：{record.corp_id}</li>
                <li>应用秘钥：{record.corp_secret}</li>
                <li>应用ID：{record.agent_id}</li>
                <li>创建人{record.creator}</li>
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
    /**
     * 获取通知渠道列表
     */
    async GetNoticeChannelListFunc () {
      try {
        const result = await getNoticeChannelList()
        if (result.status === 200) {
          this.NoticeChannelData = result.data.data
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
