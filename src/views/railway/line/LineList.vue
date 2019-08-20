<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="路线编号">
              <a-input v-model="queryParam['line.line_id__eq']" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="路线名称">
              <a-input v-model="queryParam['line.line_name__like']" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'center', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => {queryParam = {}; dateParam = {}}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
          <template v-if="advanced">
            <a-col :md="16" :sm="48">
              <a-form-item
                label="更新日期"
                :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                <a-range-picker
                  @change="onDateChange"
                  v-model="dateParam.update_date"
                  name="buildTime"
                  style="width: 100%"/>
              </a-form-item>
            </a-col>
          </template>

        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }}多选</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      :rowKey="(record) => record.id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">更新</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">删除</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { page } from '@/api/railway/line'

export default {
  name: 'LineList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // body参数
      queryParam: {},
      dateParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '铁路局编号',
          dataIndex: 'railwayBureauId',
          sorter: true
        },
        {
          title: '铁路局名称',
          dataIndex: 'railwayBureauName',
          sorter: true
        },
        {
          title: '线路编号',
          dataIndex: 'lineId',
          sorter: true
        },
        {
          title: '线路名称',
          dataIndex: 'lineName',
          sorter: true
        },
        {
          title: '备注',
          dataIndex: 'remark',
          sorter: false
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return page(parameter, this.queryParam)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: true
    }
  },
  created () {
    this.tableOption()
  },
  methods: {
    onDateChange (date, dateString) {
      this.queryParam['line.update_date__between__value'] = dateString[0]
      this.queryParam['line.update_date__between__value1'] = dateString[1]
    },
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    handleEdit (record) {
      console.log('点击了修改: ' + record.id)
      this.$refs.modal.edit(record)
    },
    handleSub (record) {
      console.log('点击了删除: ' + record)
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
