<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="插槽名称">
                <a-input v-model="queryParam" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a-button style="margin-left: 8px" icon="plus" type="primary" @click="handlerSlotRegister">新增注册</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :dataSource="reportTemplateSlotListData"
      >
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="view" type="dashed" @click="handleView(record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button size="small" icon="delete" type="danger" @click="handleDelete(record)">删除</a-button>
        </span>
      </a-table>
    </a-card>

    <new-slot-register-form
      ref="NewSlotRegisterFormRef"
      :visible="modal.slot_register_visible"
      @cancel="handleSlotRegisterCancel"
      @create="handleSlotRegisterCreate"
    />

  </page-header-wrapper>
</template>

<script>
import { getReportTemplateSlotList, createReportTemplateSlot, deleteReportTemplateSlot } from '@/api/apis/report_template'
import { Button, Modal } from 'ant-design-vue'
import NewSlotRegisterForm from './new/NewSlotRegisterForm'

export default {
  name: 'ListReportTemplateSlot',
  components: {
    Button,
    NewSlotRegisterForm
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
                    title: '插槽名称',
                    dataIndex: 'slot_name',
                    key: 'slot_name'
                },
                {
                    title: '描述',
                    dataIndex: 'slot_name_alias',
                    key: 'slot_name_alias'
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
      reportTemplateSlotListData: [],
      modal: {
        slot_register_visible: false
      }
    }
  },
  created () {
    this.GetReportTemplateSlotListFunc()
  },
  methods: {
    handleView (record) {
      Modal.success({
        title: '插槽详情如下：',
        content: (
            <ul>
                <li>模板ID：{record.template_id}</li>
                <li>名称：{record.slot_name}</li>
                <li>插槽别名：{record.slot_name_alias}</li>
                <li>创建时间：{record.created_at}</li>
                <li>更新时间：{record.updated_at}</li>
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
    handleDelete (record) {
      Modal.confirm({
        title: '你确定要删除这个插槽吗？',
        content: (
            <ul>
                <li>模板ID：{record.template_id}</li>
                <li>名称：{record.slot_name}</li>
            </ul>
        ),
        okText: '删除',
        cancelText: '取消',

        onOk: () => {
            this.DeleteReportTemplateSlotFunc(record.template_id, record.slot_name)
        },

        onCancel () {
          console.log('已取消删除')
        }
      })
    },
    /**
     * 插槽注册相关按钮触发动作
     */
    handlerSlotRegister () {
      this.modal.slot_register_visible = true
    },
    handleSlotRegisterCancel () {
      const form = this.$refs.NewSlotRegisterFormRef.form
      form.resetFields()
      this.modal.slot_register_visible = false
    },
    handleSlotRegisterCreate () {
      const form = this.$refs.NewSlotRegisterFormRef.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.CreateReportTemplateSlotFunc(values, form)
      })
    },
    /**
     * 获取模板插槽列表
     */
    async GetReportTemplateSlotListFunc () {
      try {
        const result = await getReportTemplateSlotList()
        if (result.status === 200) {
        this.reportTemplateSlotListData = result.data.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 新增模板插槽注册
     */
    async CreateReportTemplateSlotFunc (params, form) {
      var postData = {
        'template_id': params.template_id,
        'slot_name': params.slot_name,
        'slot_name_alias': params.slot_name_alias
      }
      try {
        const result = await createReportTemplateSlot(postData)
        if (result.status === 200) {
          setTimeout(() => {
            this.$notification.success({
              message: '新增成功',
              description: result.data.msg
            })
          }, 500)
          this.GetReportTemplateSlotListFunc()
          form.resetFields()
          this.modal.slot_register_visible = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 删除模板变量
     */
    async DeleteReportTemplateSlotFunc (tempalteId, varName) {
      try {
        const result = await deleteReportTemplateSlot(tempalteId, varName)
        if (result.status === 200) {
          this.GetReportTemplateSlotListFunc()
          setTimeout(() => {
            this.$notification.success({
              message: '删除成功',
              description: result.data.msg
            })
          }, 500)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
