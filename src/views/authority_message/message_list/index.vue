<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="消息ID">
                <a-input v-model="queryParam" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :dataSource="authorityMessageListData"
      >
        <span slot="message_type" slot-scope="text, record">
          <a-tag v-show="record.message_type === 'custom'" color="#2db7f5">普通类型消息</a-tag>
          <a-tag v-show="record.message_type === 'custom_oncall'" color="#87d068">日常SRE轮值</a-tag>
          <a-tag v-show="record.message_type === 'holidays_oncall'" color="#108ee9">节假日值班</a-tag>
          <a-tag v-show="record.message_type === 'srp_message'" color="#108ee9">稳定性运营报告消息</a-tag>
          <a-tag v-show="record.message_type === 'fault_message'" color="#108ee9">故障同步消息</a-tag>
        </span>
        <span slot="send_status" slot-scope="text, record">
          <a-tag v-show="record.send_status === 'NotSent'" color="#f50">未发送</a-tag>
          <a-tag v-show="record.send_status === 'Sent'" color="#87d068">已发送</a-tag>
          <a-tag v-show="record.send_status === 'Fail'" color="#f50">发送失败</a-tag>
        </span>
        <span slot="audit_status" slot-scope="text, record">
          <a-tag v-show="record.audit_status === 'NoNeedAudit'" color="#87d068">无需审核</a-tag>
          <a-tag v-show="record.audit_status === 'Disuse'" color="#f50">废弃</a-tag>
          <a-tag v-show="record.audit_status === 'Refuse'" color="#f50">拒绝</a-tag>
          <a-tag v-show="record.audit_status === 'NotApproved'" color="#f50">未审核</a-tag>
          <a-tag v-show="record.audit_status === 'Reviewed'" color="#87d068">已审核</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="line-chart" @click="handleAuthorityMessageRenderProgress(record)">渲染进度</a-button>
          <a-divider type="vertical" />
          <a-button v-show="record.send_status === 'NotSent' && (record.audit_status === 'NotApproved' || record.audit_status === 'NoNeedAudit') && (record.merge_status === 'MergeD' || record.var_list === '')" size="small" icon="step-forward" type="dashed" @click="handleAuthorityMessageSend(record,'test')">测试发送</a-button>
          <a-divider v-show="record.send_status === 'NotSent' && (record.audit_status === 'NotApproved' || record.audit_status === 'NoNeedAudit') && (record.merge_status === 'MergeD' || record.var_list === '')" type="vertical" />
          <a-button v-show="(record.audit_status === 'Reviewed' || record.audit_status === 'NoNeedAudit') && record.send_status === 'NotSent' && (record.merge_status === 'MergeD' || record.var_list === '' )" size="small" icon="fast-forward" type="primary" @click="handleAuthorityMessageSend(record,'release')">正式发送</a-button>
          <a-divider v-show="(record.audit_status === 'Reviewed' || record.audit_status === 'NoNeedAudit') && record.send_status === 'NotSent' && (record.merge_status === 'MergeD' || record.var_list === '')" type="vertical" />
          <a-dropdown-button size="small">
            更多
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="1" @click="handleAuthorityMessageDetail(record)"> <a-icon type="eye" />详情 </a-menu-item>
              <a-menu-item key="2" @click="handleAuthorityMessageSendHistory(record)"> <a-icon type="unordered-list" />发送历史 </a-menu-item>
              <a-menu-item key="3" v-show="(record.send_status === 'NotSent' && record.audit_status === 'NoNeedAudit') || record.audit_status === 'NotApproved' && (record.merge_status === 'MergeD' || record.var_list === '')" @click="gotoEditPage(record)"> <a-icon type="edit" />编辑 </a-menu-item>
              <a-menu-item key="4" v-show="record.audit_status === 'NotApproved' && (record.merge_status === 'MergeD' || record.var_list === '')" @click="handleAuditAuthorityMessage(record)"> <a-icon type="user" />审核 </a-menu-item>
              <a-menu-item key="5" v-show="record.audit_status !== 'Disuse' && record.send_status !== 'Sent'" @click="AuditAuthorityMessageFunc('Disuse')"> <a-icon type="delete" />废弃 </a-menu-item>
              <a-menu-item key="6" v-show="record.send_status === 'Sent' && (record.merge_status === 'MergeD' || record.var_list === '')" @click="handleAuthorityMessageSend(record,'release')"> <a-icon type="fast-forward" />再次发送 </a-menu-item>
            </a-menu>
          </a-dropdown-button>
        </span>
      </a-table>
    </a-card>

    <a-modal
      v-model="modal.render_progress_visible"
      title="渲染进度(会自动刷新进度，5s一次)"
      @cancel="handleAuthorityMessageRenderProgressOk"
      @ok="handleAuthorityMessageRenderProgressOk"
      width="1200px">
      <div style="width: 1100px">
        <a-alert
          message="温馨提示"
          description="权威消息中涉及到变量的话，会在查看渲染进度的过程中自动渲染内容主体，如果出现未渲染状态，请再次打开渲染进度弹窗！"
          type="info"
          show-icon
        />
      </div>
      <a-divider />
      <div style="width: 1100px">
        <a-progress :percent="modal.renderProgress" status="active" />
      </div>
      <a-divider />
      <a-table
        :columns="render_progress_columns"
        :dataSource="modal.renderProgressRecordData"
      >
        <span slot="render_status" slot-scope="text, record">
          <a-tag v-show="record.render_status === 0 " color="#f50">未渲染</a-tag>
          <a-tag v-show="record.render_status === 1" color="#87d068">渲染成功</a-tag>
          <a-tag v-show="record.render_status === 2" color="#f50">渲染失败</a-tag>
          <a-tag v-show="record.render_status === 3" color="#00EC00">未注册</a-tag>
        </span>
      </a-table>
    </a-modal>

    <a-modal
      v-model="modal.authority_message_send_history_visible"
      title="消息发送历史"
      @cancel="handleAuthorityMessageSendHistoryClose"
      @ok="handleAuthorityMessageSendHistoryClose"
      width="1200px">
      <a-table
        :columns="send_history_columns"
        :dataSource="modal.authorityMessageSendHistory"
      >
        <span slot="send_type" slot-scope="text, record">
          <a-tag v-show="record.send_type === 'test' " color="#FFCC66">测试发送</a-tag>
          <a-tag v-show="record.send_type === 'release' " color="#87d068">正式发送</a-tag>
        </span>
        <span slot="send_status" slot-scope="text, record">
          <a-tag v-show="record.send_status === 'Fail' " color="#f50">发送失败</a-tag>
          <a-tag v-show="record.send_status === 'Sent' " color="#87d068">发送成功</a-tag>
        </span>
      </a-table>
    </a-modal>

    <a-modal
      v-model="modal.authority_message_audit_visible"
      title="审核权威消息"
      @cancel="handleAuthorityMessageAuditClose"
      @ok="handleAuthorityMessageAuditClose"
      width="800px">
      <ul>
        <li>模板ID：{{ modal.authority_message_audit_message_id }}</li>
      </ul>
      <template slot="footer">
        <a-button size="small" @click="handleAuthorityMessageAuditClose">取消</a-button>
        <a-button size="small" type="primary" @click="AuditAuthorityMessageFunc('Reviewed')">通过</a-button>
        <a-button size="small" type="danger" @click="AuditAuthorityMessageFunc('Refuse')">拒绝</a-button>
        <a-button size="small" type="dashed" @click="AuditAuthorityMessageFunc('Disuse')">废弃</a-button>
      </template>
    </a-modal>

  </page-header-wrapper>
</template>

<script>
import { getRenderProgress, mergeRenderRecordToContent } from '@/api/apis/report_template'
import { getAuthorityMessageList, authorityMessageSend, getAuthorityMessageSendHistory, auditAuthorityMessage, getAuthorityMessage } from '@/api/apis/authority_message'
import { Button, Modal } from 'ant-design-vue'
export default {
  name: 'AuthorityMessageList',
  components: {
    Button
  },
  computed: {
        columns () {
            return [
                {
                    title: '消息ID',
                    dataIndex: 'message_id',
                    key: 'message_id'
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '类型',
                    dataIndex: 'message_type',
                    key: 'message_type',
                    scopedSlots: { customRender: 'message_type' },
                    filters: [
                      { text: '普通类型消息', value: 'custom' },
                      { text: '日常SRE轮值消息', value: 'custom_oncall' },
                      { text: '节假日值班消息', value: 'holidays_oncall' },
                      { text: '稳定性运营报告消息', value: 'srp_message' },
                      { text: '故障同步消息', value: 'fault_message' }
                    ],
                    onFilter: (value, record) => record.message_type.indexOf(value) === 0
                },
                {
                    title: '创建者',
                    dataIndex: 'creator',
                    key: 'creator'
                },
                {
                    title: '发送状态',
                    dataIndex: 'send_status',
                    key: 'send_status',
                    scopedSlots: { customRender: 'send_status' }
                },
                {
                    title: '审核状态',
                    dataIndex: 'audit_status',
                    key: 'audit_status',
                    scopedSlots: { customRender: 'audit_status' }
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ]
        },
        render_progress_columns () {
            return [
                {
                    title: '资源ID',
                    dataIndex: 'resource_id',
                    key: 'resource_id'
                },
                {
                    title: '名称',
                    dataIndex: 'var_name',
                    key: 'var_name'
                },
                {
                    title: '渲染状态',
                    dataIndex: 'render_status',
                    key: 'render_status',
                    scopedSlots: { customRender: 'render_status' },
                    filters: [
                      { text: '未渲染', value: 0 },
                      { text: '渲染成功', value: 1 },
                      { text: '渲染失败', value: 2 },
                      { text: '未注册', value: 3 }
                    ],
                    onFilter: (value, record) => record.render_status.indexOf(value) === 0
                },
                {
                    title: '渲染唯一ID',
                    dataIndex: 'render_id',
                    key: 'render_id'
                },
                {
                    title: '渲染用时',
                    dataIndex: 'render_time',
                    key: 'render_time'
                }
            ]
        },
        send_history_columns () {
            return [
                {
                    title: '发送时间',
                    dataIndex: 'created_at',
                    key: 'created_at'
                },
                {
                    title: '发送类型',
                    dataIndex: 'send_type',
                    key: 'send_type',
                    scopedSlots: { customRender: 'send_type' }
                },
                {
                    title: '发送状态',
                    dataIndex: 'send_status',
                    key: 'send_status',
                    scopedSlots: { customRender: 'send_status' }
                },
                {
                    title: '发送人',
                    dataIndex: 'creator',
                    key: 'creator'
                }
            ]
        }
  },
  data () {
    return {
      queryParam: '',
      authorityMessageListData: [],
      modal: {
        render_progress_visible: false,
        isMerging: false,
        renderProgressRecordData: [],
        renderProgress: 0,
        isMergingMessageStatus: '',
        authority_message_send_history_visible: false,
        authorityMessageSendHistory: [],
        authority_message_audit_visible: false,
        authority_message_audit_message_id: ''
      }
    }
  },
  created () {
    this.GetAuthorityMessageListFunc()
    window.setInterval(() => {
      if (this.modal.isMerging === true) {
        this.GetAuthorityMessageListFunc()
      }
    }, 5000)
  },
  methods: {
    gotoEditPage (record) {
      this.$router.push({
        name: 'message_edit',
        query: {
          message_id: record.message_id
        }
      })
    },
    /**
     * 查看渲染进度按钮触发动作
     */
    handleAuthorityMessageRenderProgress (record) {
      if (record.var_list !== '') {
        this.modal.render_progress_visible = true
        this.GetRenderProgressFunc(record.render_id, record.message_id, 'authority_message')
        if (record.merge_status !== 'MergeD' && this.modal.renderProgress === 100 && this.modal.isMerging === false && this.modal.isMergingMessageStatus !== 'MergeD') {
          this.modal.isMerging = true
          this.MergeRenderRecordToContentFunc(record)
        } else {
          window.setInterval(() => {
            if (this.modal.renderProgress < 100) {
              this.GetRenderProgressFunc(record.render_id, record.message_id, 'authority_message')
            } else if (this.modal.renderProgress === 100 && this.modal.isMergingMessageStatus !== 'MergeD' && this.modal.isMerging === false) {
                this.GetAuthorityMessageFunc(record.message_id)
                if (this.modal.isMergingMessageStatus !== 'MergeD' && this.modal.isMergingMessageStatus !== '' && this.modal.renderProgress === 100 && this.modal.isMerging === false) {
                  this.modal.isMerging = true
                  this.MergeRenderRecordToContentFunc(record)
                }
            }
          }, 5000)
        }
      } else {
        setTimeout(() => {
              this.$notification.warning({
                message: '警告',
                description: '没有需要渲染的变量'
              })
          }, 0)
      }
    },
    handleAuthorityMessageRenderProgressOk () {
      this.modal.render_progress_visible = false
      this.modal.renderProgressRecordData = []
      this.modal.renderProgress = 0
      this.modal.isMerging = false
    },
    /**
     * 查看发送历史
     */
    handleAuthorityMessageSendHistory (record) {
      this.modal.authority_message_send_history_visible = true
      this.GetAuthorityMessageSendHistoryFunc(record.message_id)
    },
    handleAuthorityMessageSendHistoryClose () {
      this.modal.authority_message_send_history_visible = false
      this.modal.authorityMessageSendHistory = []
    },
    /**
     * 审核权威消息
     */
    handleAuditAuthorityMessage (record) {
      this.modal.authority_message_audit_visible = true
      this.modal.authority_message_audit_message_id = record.message_id
    },
    handleAuthorityMessageAuditClose () {
      this.modal.authority_message_audit_visible = false
      this.modal.authorityMessageAuditData = []
    },
    /**
     * 更多按钮触发函数
     */
    handleMenuClick (e) {
      console.log('click', e)
    },
    /**
     * 查看消息详情
     */
    handleAuthorityMessageDetail (record) {
      Modal.info({
        title: '消息详情',
        content: (
            <ul>
                <li>消息ID ：{record.message_id}</li>
                <li>名称：{record.name}</li>
                <li>发送状态：{record.send_status}</li>
                <li>审核状态：{record.audit_status}</li>
                <li>合并状态：{record.merge_status}</li>
                <li>消息类型：{record.message_type}</li>
                <li>创建者：{record.creator}</li>
                <li>消息内容：{record.content}</li>
                <li>通知渠道：{record.notice_channel_id}</li>
                <li>审核人：{record.reviewer}</li>
                <li>渲染ID：{record.render_id}</li>
            </ul>
        ),
        okText: '确认',
        cancelText: '取消',

        onOk: () => {
        },
        onCancel () {
        }
      })
    },
    /**
     * 发送消息相关按钮
     */
    handleAuthorityMessageSend (record, sendType) {
      Modal.confirm({
        title: '你确定要发送这条消息吗',
        content: (
            <ul>
                <li>消息ID ：{record.message_id}</li>
                <li>名称：{record.name}</li>
                <li>发送类型：{sendType}</li>
            </ul>
        ),
        okText: '确认',
        cancelText: '取消',

        onOk: () => {
          this.AuthorityMessageSendFunc(record.message_id, sendType)
        },
        onCancel () {
          console.log('取消')
        }
      })
    },
    /**
     * 获取权威消息列表
     */
    async GetAuthorityMessageListFunc () {
      try {
        const result = await getAuthorityMessageList()
        if (result.status === 200) {
          this.authorityMessageListData = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 获取消息渲染进度
     */
    async GetRenderProgressFunc (renderId, resouceId, resourceType) {
      try {
        const result = await getRenderProgress(renderId, resouceId, resourceType)
        if (result.status === 200) {
          this.modal.renderProgressRecordData = result.data.data.render_record
          this.modal.renderProgress = result.data.data.render_progress
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 合并变量记录到消息主体
     */
    async MergeRenderRecordToContentFunc (record) {
      if (record.merge_status !== 'MergeD') {
        var postData = {
        'resource_id': record.message_id,
        'resource_type': 'authority_message',
        'render_id': record.render_id
        }
        try {
          const result = await mergeRenderRecordToContent(postData)
          if (result.status === 200 && result.data.data === 'ok') {
            console.log('merge success')
            this.GetAuthorityMessageListFunc()
            this.modal.isMerging = false
          } else {
            setTimeout(() => {
              this.$notification.success({
                message: '渲染提示',
                description: '请稍后，消息内容正在渲染中····'
              })
              }, 0)
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    /**
     * 发送权威消息函数
     */
    async AuthorityMessageSendFunc (messageId, sendType) {
      try {
        const result = await authorityMessageSend(messageId, sendType)
        if (result.status === 200) {
          setTimeout(() => {
              this.$notification.success({
                message: '发送成功',
                description: result.data.msg
              })
          }, 0)
          this.GetAuthorityMessageListFunc()
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 权威消息发送历史函数
     */
    async GetAuthorityMessageSendHistoryFunc (messageId) {
      try {
        const result = await getAuthorityMessageSendHistory(messageId)
        if (result.status === 200) {
          this.modal.authorityMessageSendHistory = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 审核权威消息函数
     */
    async AuditAuthorityMessageFunc (auditStatus) {
      try {
        const result = await auditAuthorityMessage(this.modal.authority_message_audit_message_id, auditStatus)
        if (result.status === 200) {
          this.modal.authority_message_audit_visible = false
          setTimeout(() => {
              this.$notification.success({
                message: result.data.data,
                description: result.data.msg
              })
          }, 0)
          this.GetAuthorityMessageListFunc()
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 获取权威消息列表
     */
    async GetAuthorityMessageFunc (messageId) {
      try {
        const result = await getAuthorityMessage(messageId)
        if (result.status === 200) {
          this.modal.isMergingMessageStatus = result.data.data.merge_status
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
