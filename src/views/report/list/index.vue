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
        :dataSource="reportListData"
      >
        <span slot="report_type" slot-scope="text, record">
          <a-tag v-show="record.report_type === 'hourly'" color="#2db7f5">小时报</a-tag>
          <a-tag v-show="record.report_type === 'daily'" color="#87d068">日报</a-tag>
          <a-tag v-show="record.report_type === 'weekly'" color="#108ee9">周报</a-tag>
          <a-tag v-show="record.report_type === 'monthly'" color="#108ee9">月报</a-tag>
          <a-tag v-show="record.report_type === 'yearly'" color="#108ee9">年报</a-tag>
          <a-tag v-show="record.report_type === 'inspection'" color="#87d068">巡检报</a-tag>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-tag v-show="record.status === 'NotRendered'" color="#f50">未渲染</a-tag>
          <a-tag v-show="record.status === 'RenderIng'" color="#CCCC33">渲染中</a-tag>
          <a-tag v-show="record.status === 'ToBeMergeD'" color="#CCCC33">待合并</a-tag>
          <a-tag v-show="record.status === 'ToBeLabeled'" color="#CCCC33">待标注</a-tag>
          <a-tag v-show="record.status === 'Published'" color="#87d068">已发布</a-tag>
        </span>
        <span slot="merge_status" slot-scope="text, record">
          <a-tag v-show="record.merge_status === 'NotMerge'" color="#f50">未合并</a-tag>
          <a-tag v-show="record.merge_status === 'MergeD'" color="#87d068">已合并</a-tag>
          <a-tag v-show="record.merge_status === 'MergeError'" color="#f50">合并失败</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="line-chart" @click="handleReportProgress(record)">渲染进度</a-button>
          <a-divider type="vertical" />
          <a-button size="small" icon="eye" @click="handleReportDetail(record)">报告详情</a-button>
          <a-divider type="vertical" />
          <a-button v-show="record.status === 'Published'" size="small" icon="step-forward" type="dashed">查看报告</a-button>
          <a-divider v-show="record.status === 'Published'" type="vertical" />
          <a-button v-show="record.status === 'NotRendered'" size="small" icon="step-forward" type="dashed" @click="handleRenderReport(record)">渲染</a-button>
          <a-divider v-show="record.status === 'NotRendered'" type="vertical" />
          <a-button v-show="record.status === 'ToBeLabeled' || record.status === 'RenderIng'" size="small" icon="step-forward" type="dashed">预览</a-button>
          <a-divider v-show="record.status === 'ToBeLabeled' || record.status === 'RenderIng'" type="vertical" />
          <a-dropdown-button size="small" v-show="record.status === 'ToBeLabeled' || record.status === 'RenderIng'">
            更多
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="1" v-show="record.status === 'ToBeLabeled' || record.status === 'RenderIng'"> <a-icon type="edit" />编辑 </a-menu-item>
              <a-menu-item key="2" v-show="record.status === 'ToBeLabeled' || record.status === 'RenderIng'"> <a-icon type="unordered-list" />完结 </a-menu-item>
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
        <a-progress :percent="modal.renderProgress" status="active" />
      </div>
      <a-divider />
      <div style="width: 1100px">
        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="mergeConfirm" :disabled="modal.merge_button_status">
          <template slot="title">
            <p>你确定要合并这个报告吗？</p>
          </template>
          <a-button size="small" type="primary" icon="api" :disabled="modal.merge_button_status">点击我合并</a-button>
        </a-popconfirm>
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

  </page-header-wrapper>
</template>

<script>
import { getRenderProgress, mergeRenderRecordToContent } from '@/api/apis/report_template'
import { getReportList, renderReport } from '@/api/apis/report'
import { Button, Modal } from 'ant-design-vue'
export default {
  name: 'ReportList',
  components: {
    Button
  },
  computed: {
        columns () {
            return [
                {
                    title: '报告ID',
                    dataIndex: 'report_id',
                    key: 'report_id'
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '类型',
                    dataIndex: 'report_type',
                    key: 'report_type',
                    scopedSlots: { customRender: 'report_type' },
                    filters: [
                      { text: '小时报', value: 'hourly' },
                      { text: '日报', value: 'daily' },
                      { text: '周报', value: 'weekly' },
                      { text: '月报', value: 'monthly' },
                      { text: '年报', value: 'yearly' },
                      { text: '巡检报', value: 'inspection' }
                    ],
                    onFilter: (value, record) => record.report_type.indexOf(value) === 0
                },
                {
                    title: '创建者',
                    dataIndex: 'creator',
                    key: 'creator'
                },
                {
                    title: '报告状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '合并状态',
                    dataIndex: 'merge_status',
                    key: 'merge_status',
                    scopedSlots: { customRender: 'merge_status' }
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
        }
  },
  data () {
    return {
      queryParam: '',
      reportListData: [],
      modal: {
        render_progress_visible: false,
        isRending: false,
        renderProgressRecordData: [],
        renderProgress: 0,
        merge_button_status: true,
        report_id: '',
        render_id: ''
      }
    }
  },
  created () {
    this.GetReportListFunc()
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
    handleReportProgress (record) {
      if (record.merge_status === 'NotMerge') {
        this.modal.merge_button_status = false
        this.modal.report_id = record.report_id
        this.modal.render_id = record.render_id
      }
      if (record.var_list !== '') {
        this.modal.render_progress_visible = true
        this.modal.isRending = true
        this.GetRenderProgressFunc(record.render_id, record.report_id, 'report')
        if (this.modal.renderProgress === 100) {
          this.modal.isRending = false
        } else {
          window.setInterval(() => {
            if (this.modal.renderProgress < 100 && this.modal.isRending === true && record.status === 'RenderIng' && record.merge_status === 'NotMerge') {
              this.GetRenderProgressFunc(record.render_id, record.report_id, 'report')
            } else if (this.modal.renderProgress === 100) {
              this.modal.isRending = false
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
      this.modal.isRending = false
      this.modal.merge_button_status = true
      this.modal.report_id = ''
      this.modal.render_id = ''
    },
    /**
     * 渲染按钮
     */
    handleRenderReport (record) {
      Modal.confirm({
        title: '你确定要开始渲染这个报告吗？',
        content: (
            <ul>
                <li>报告ID ：{record.report_id}</li>
                <li>名称：{record.name}</li>
            </ul>
        ),
        okText: '确认',
        cancelText: '取消',

        onOk: () => {
          this.RenderReportFunc(record.report_id)
        },
        onCancel () {
          console.log('取消')
        }
      })
    },
    /**
     * 更多按钮触发函数
     */
    handleMenuClick (e) {
      console.log('click', e)
    },
    mergeConfirm () {
      this.MergeRenderRecordToContentFunc()
    },
    /**
     * 查看消息详情
     */
    handleReportDetail (record) {
      Modal.info({
        title: '消息详情',
        content: (
            <ul>
                <li>报告ID ：{record.report_id}</li>
                <li>名称：{record.name}</li>
                <li>模板ID：{record.template_id}</li>
                <li>报告类型：{record.report_type}</li>
                <li>状态：{record.status}</li>
                <li>起时间：{record.start_time}</li>
                <li>止时间：{record.end_time}</li>
                <li>预览ID：{record.preview_hash}</li>
                <li>渲染ID：{record.render_id}</li>
                <li>合并状态：{record.merge_status}</li>
                <li>创建人：{record.creator}</li>
                <li>创建时间：{record.created_at}</li>
                <li>更新时间：{record.updated_at}</li>
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
     * 获取报告列表函数
     */
    async GetReportListFunc () {
      try {
        const result = await getReportList()
        if (result.status === 200) {
          this.reportListData = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 获取报告渲染进度函数
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
     * 渲染报告函数
     */
    async RenderReportFunc (reportId) {
      try {
        const result = await renderReport(reportId)
        if (result.status === 200) {
          this.GetReportListFunc()
          this.modal.isRending = true
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 合并变量记录到消息主体
     */
    async MergeRenderRecordToContentFunc () {
      var postData = {
      'resource_id': this.modal.report_id,
      'resource_type': 'report',
      'render_id': this.modal.render_id
      }
      try {
        const result = await mergeRenderRecordToContent(postData)
        if (result.status === 200 && result.data.data === 'ok') {
          console.log('merge success')
          this.GetReportListFunc()
          this.modal.merge_button_status = true
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
  }
}
</script>
