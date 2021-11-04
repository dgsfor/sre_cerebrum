<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="变量名称">
                <a-input v-model="queryParam" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a-button style="margin-left: 8px" icon="plus" type="primary" @click="handlerVarRegister">新增注册</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :dataSource="reportTemplateVarListData"
      >
        <span slot="var_type" slot-scope="text, record">
          <a-tag v-show="record.var_type === 'inner_var'" color="#2db7f5">内置变量</a-tag>
          <a-tag v-show="record.var_type === 'custom_var'" color="#87d068">自定义变量</a-tag>
          <a-tag v-show="record.var_type === 'img_var'" color="#108ee9">图片变量</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" icon="view" type="dashed" @click="handleView(record)">查看</a-button>
          <a-divider type="vertical" v-show="record.var_type !== 'inner_var'" />
          <a-button v-show="record.var_type !== 'inner_var'" size="small" icon="delete" type="danger" @click="handleDelete(record)">删除</a-button>
          <a-divider type="vertical" v-show="record.var_type !== 'inner_var'" />
          <a-button v-show="record.var_type !== 'inner_var'" size="small" icon="edit">编辑</a-button>
        </span>
      </a-table>
    </a-card>

    <new-var-register-form
      ref="NewVarRegisterFormRef"
      :visible="modal.var_register_visible"
      @cancel="handleVarRegisterCancel"
      @create="handleVarRegisterCreate"
    />

  </page-header-wrapper>
</template>

<script>
import { getReportTemplateVarList, createReportTemplateVar, deleteReportTemplateVar } from '@/api/apis/report_template'
import { Button, Modal } from 'ant-design-vue'
import NewVarRegisterForm from './new/NewVarRegisterForm'

export default {
  name: 'ListReportTemplateVar',
  components: {
    Button,
    NewVarRegisterForm
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
                    dataIndex: 'var_name',
                    key: 'var_name'
                },
                {
                    title: '类型',
                    dataIndex: 'var_type',
                    key: 'var_type',
                    scopedSlots: { customRender: 'var_type' },
                    filters: [
                      { text: '内置变量', value: 'inner_var' },
                      { text: '自定义变量', value: 'custom_var' },
                      { text: '图片变量', value: 'img_var' }
                    ],
                    onFilter: (value, record) => record.var_type.indexOf(value) === 0
                },
                {
                    title: '描述',
                    dataIndex: 'var_desc',
                    key: 'var_desc',
                    scopedSlots: { customRender: 'var_desc' }
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
      reportTemplateVarListData: [],
      modal: {
        var_register_visible: false
      }
    }
  },
  created () {
    this.GetReportTemplateVarListFunc()
  },
  methods: {
    handleView (record) {
      Modal.success({
        title: '变量详情如下：',
        content: (
            <ul>
                <li>模板ID：{record.template_id}</li>
                <li>名称：{record.var_name}</li>
                <li>URL：{record.var_url}</li>
                <li>Header：{record.var_header}</li>
                <li>字段：{record.var_result_field}</li>
                <li>类型：{record.var_type}</li>
                <li>描述：{record.var_desc}</li>
                <li>创建人：{record.creator}</li>
                <li>创建时间{record.created_at}</li>
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
        title: '你确定要删除这个变量吗？',
        content: (
            <ul>
                <li>模板ID：{record.template_id}</li>
                <li>名称：{record.var_name}</li>
            </ul>
        ),
        okText: '删除',
        cancelText: '取消',

        onOk: () => {
            this.DeleteReportTemplateVarFunc(record.template_id, record.var_name)
        },

        onCancel () {
          console.log('已取消删除')
        }
      })
    },
    /**
     * 变量注册相关按钮触发动作
     */
    handlerVarRegister () {
      this.modal.var_register_visible = true
    },
    handleVarRegisterCancel () {
      const form = this.$refs.NewVarRegisterFormRef.form
      form.resetFields()
      this.modal.var_register_visible = false
    },
    handleVarRegisterCreate () {
      const form = this.$refs.NewVarRegisterFormRef.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.CreateReportTemplateVarFunc(values, form)
      })
    },
    /**
     * 获取模板变量列表
     */
    async GetReportTemplateVarListFunc () {
      try {
        const result = await getReportTemplateVarList()
        if (result.status === 200) {
        this.reportTemplateVarListData = result.data.data
          setTimeout(() => {
            this.$notification.success({
              message: '成功',
              description: result.data.msg
            })
        }, 500)
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 新增模板变量
     */
    async CreateReportTemplateVarFunc (params, form) {
      var postData = {
        'template_id': params.template_id,
        'var_name': params.var_name,
        'var_url': params.var_url,
        'var_result_field': params.var_result_field,
        'var_header': params.var_header,
        'var_type': params.var_type,
        'var_desc': params.var_desc
      }
      try {
        const result = await createReportTemplateVar(postData)
        if (result.status === 200) {
          setTimeout(() => {
            this.$notification.success({
              message: '新增成功',
              description: result.data.msg
            })
          }, 500)
          this.GetReportTemplateVarListFunc()
          form.resetFields()
          this.modal.var_register_visible = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 删除模板变量
     */
    async DeleteReportTemplateVarFunc (tempalteId, varName) {
      try {
        const result = await deleteReportTemplateVar(tempalteId, varName)
        if (result.status === 200) {
          this.GetReportTemplateVarListFunc()
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
