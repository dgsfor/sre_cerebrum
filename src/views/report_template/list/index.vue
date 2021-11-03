<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模板ID">
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
        :dataSource="reportTemplateListData"
      >
        <span slot="type" slot-scope="text, record">
          <a-tag v-show="record.type === 'open_temp'" color="#2db7f5">开放模板</a-tag>
          <a-tag v-show="record.type === 'cron_temp'" color="#87d068">周期模板</a-tag>
          <a-tag v-show="record.type === 'authoritative_temp'" color="#108ee9">权威消息模板</a-tag>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-tag v-show="record.status === 'enable'" color="#87d068">可用</a-tag>
          <a-tag v-show="record.status === 'disable'" color="#f50">禁用</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="delete" type="danger" @click="handleDelete(record)">删除</a-button>
          <a-divider type="vertical" />
          <a-button v-show="record.status === 'enable'" size="small" icon="lock" @click="handleUpdateStatus(record)">禁用</a-button>
          <a-button v-show="record.status === 'disable'" size="small" icon="unlock" @click="handleUpdateStatus(record)">解禁</a-button>
          <a-divider type="vertical" v-show="record.status === 'enable'" />
          <a-button v-show="record.status === 'enable'" size="small" icon="edit" @click="gotoEditPage(record)">编辑</a-button>
          <a-divider type="vertical" v-show="record.status === 'enable'" />
          <a-button v-show="record.status === 'enable' && record.type === 'open_temp' || record.type === 'cron_temp'" size="small" icon="export" type="primary">生成报告</a-button>
          <a-button v-show="record.type === 'authoritative_temp' && record.status === 'enable'" size="small" icon="message" type="dashed">创建消息</a-button>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getReportTemplateList, deleteReportTemplate, updateReportTemplateStatus } from '@/api/apis/report_template'
import { Button, Modal } from 'ant-design-vue'
export default {
  name: 'ListReportTemplate',
  components: {
    Button
  },
  computed: {
        columns () {
            return [
                {
                    title: '模板ID',
                    dataIndex: 'template_id',
                    key: 'template_id'
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    scopedSlots: { customRender: 'type' },
                    filters: [
                      { text: '开放模板', value: 'open_temp' },
                      { text: '周期模板', value: 'cron_temp' },
                      { text: '权威消息模板', value: 'authoritative_temp' }
                    ],
                    onFilter: (value, record) => record.type.indexOf(value) === 0
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' }
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
        }
  },
  data () {
    return {
      queryParam: '',
      reportTemplateListData: []
    }
  },
  created () {
    this.GetReportTemplateListFunc()
  },
  methods: {
    gotoEditPage (record) {
      this.$router.push({
        name: 'edit',
        query: {
          template_id: record.template_id
        }
      })
    },
    handleDelete (record) {
      Modal.confirm({
        title: '你确定要删除这个模板吗？',
        content: (
            <ul>
                <li>ID ：{record.template_id}</li>
                <li>名称：{record.name}</li>
            </ul>
        ),
        okText: '删除',
        cancelText: '取消',

        onOk: () => {
            this.DeleteReportTemplateFunc(record.template_id)
        },

        onCancel () {
          console.log('已取消删除')
        }
      })
    },
    handleUpdateStatus (record) {
      Modal.confirm({
        title: '你确定要更新这个模板吗？',
        content: (
            <ul>
                <li>ID ：{record.template_id}</li>
                <li>名称：{record.name}</li>
                <li>状态：{record.status}</li>
            </ul>
        ),
        okText: '更新',
        cancelText: '取消',

        onOk: () => {
            var status = ''
            if (record.status === 'enable') {
                status = 'disable'
            } else if (record.status === 'disable') {
                status = 'enable'
            }
            this.UpdateReportTemplateStatusFunc(record.template_id, status)
        },

        onCancel () {
          console.log('已取消更新')
        }
      })
    },
    /**
     * 获取运营模板列表
     */
    async GetReportTemplateListFunc () {
      try {
        const result = await getReportTemplateList()
        this.reportTemplateListData = result.data.data
        setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
        }, 500)
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 删除运营模板
     */
    async DeleteReportTemplateFunc (params) {
      try {
        const result = await deleteReportTemplate(params)
        this.GetReportTemplateListFunc()
        setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
        }, 500)
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 更新运营模板状态
     */
    async UpdateReportTemplateStatusFunc (templateId, status) {
      try {
        const result = await updateReportTemplateStatus(templateId, status)
        this.GetReportTemplateListFunc()
        setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
        }, 500)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
