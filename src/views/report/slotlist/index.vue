<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="报告ID">
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
        @expand="onExpand"
      >
        <span slot="report_type" slot-scope="text, record">
          <a-tag v-show="record.report_type === 'hourly'" color="#2db7f5">小时报</a-tag>
          <a-tag v-show="record.report_type === 'daily'" color="#87d068">日报</a-tag>
          <a-tag v-show="record.report_type === 'weekly'" color="#108ee9">周报</a-tag>
          <a-tag v-show="record.report_type === 'monthly'" color="#108ee9">月报</a-tag>
          <a-tag v-show="record.report_type === 'yearly'" color="#108ee9">年报</a-tag>
          <a-tag v-show="record.report_type === 'inspection'" color="#87d068">巡检报</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="sync" @click="handleSlorMerge(record)">合并</a-button>
        </span>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="expandedReportSlots"
        >
          <span slot="slot_status" slot-scope="text, record">
            <a-tag v-show="record.slot_status === 1" color="#f50">未注册</a-tag>
            <a-tag v-show="record.slot_status === 2" color="#CCCC33">未批注</a-tag>
            <a-tag v-show="record.slot_status === 3" color="#87d068">已批注</a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button size="small" icon="eye" @click="handleSlotDetail(record)">查看</a-button>
            <a-divider type="vertical" />
            <a-button size="small" icon="edit" type="dashed">批注</a-button>
            <a-divider type="vertical" />
            <a-button size="small" icon="unordered-list" type="primary">完成</a-button>
          </span>
        </a-table>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getReportList, getReportSlotAnnotateList } from '@/api/apis/report'
import { Button, Modal } from 'ant-design-vue'
export default {
  name: 'SlotList',
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
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ]
        },
        innerColumns () {
            return [
                {
                    title: '插槽名称',
                    dataIndex: 'slot_name',
                    key: 'slot_name'
                },
                {
                    title: '别名',
                    dataIndex: 'slot_name_alias',
                    key: 'slot_name_alias'
                },
                {
                    title: '标签',
                    dataIndex: 'annotate_tag',
                    key: 'annotate_tag'
                },
                {
                    title: '状态',
                    dataIndex: 'slot_status',
                    key: 'slot_status',
                    scopedSlots: { customRender: 'slot_status' }
                },
                {
                    title: '批注人',
                    dataIndex: 'creator',
                    key: 'creator'
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ]
        }
  },
  data () {
    return {
      queryParam: '',
      reportListData: [],
      expandedReportId: '',
      expandedReportSlots: []
    }
  },
  created () {
    this.GetReportListFunc()
  },
  methods: {
     /**
     * 完结按钮
     */
    handleFinishReport (record) {
      Modal.confirm({
        title: '你确定要完结这个报告吗？',
        content: (
            <ul>
                <li>报告ID ：{record.report_id}</li>
                <li>名称：{record.name}</li>
            </ul>
        ),
        okText: '确认',
        cancelText: '取消',

        onOk: () => {
          this.FinishReportFunc(record.report_id)
        },
        onCancel () {
          console.log('取消')
        }
      })
    },
    /**
     * 查看插槽详情
     */
    handleSlotDetail (record) {
      Modal.info({
        title: '插槽详情',
        content: (
            <ul>
                <li>报告ID ：{record.report_id}</li>
                <li>名称：{record.slot_name}</li>
                <li>别名：{record.slot_name_alias}</li>
                <li>批注内容：{record.annotate_content}</li>
                <li v-show={record.slot_status === 1}>状态：未注册</li>
                <li v-show={record.slot_status === 2}>状态：未批注</li>
                <li v-show={record.slot_status === 3}>状态：已批注</li>
                <li>批注人：{record.creator}</li>
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
    onExpand (expanded, record) {
        if (expanded) {
            if (record.report_id !== this.expandedReportId) {
                console.log('get slot list')
                this.GetReportSlotAnnotateListFunc(record.report_id)
                this.expandedReportId = record.report_id
            } else {
                console.log('use old')
            }
        }
    },
    handleSlorMerge (record) {
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
     * 获取报告绑定的插槽列表函数
     */
    async GetReportSlotAnnotateListFunc (reportId) {
      try {
        const result = await getReportSlotAnnotateList(reportId)
        if (result.status === 200) {
          this.expandedReportSlots = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
