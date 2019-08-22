<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="车站编号 ">
              <a-input v-model="queryParam['line.line_id__eq']" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="车站名称">
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
      <a-button type="primary" icon="plus" @click="handleEdit(0)">新建</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }}多选</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
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

      <span slot="xingbie" slot-scope="xingbie">
        <a-tag color="blue">{{ xingbie | xingbieFilter }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record.id)">编辑</a>
          <a-divider type="vertical" />

        </template>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { page } from '@/api/railway/station'

const xingbieMap = new Map()
xingbieMap.set('S', '上行')
xingbieMap.set('X', '下行')
xingbieMap.set('D', '单行')

export default {
  name: 'StationList',
  components: {
    STable
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
          dataIndex: 'railwayLineId',
          sorter: true
        },
        {
          title: '线路名称',
          dataIndex: 'railwayLineName',
          sorter: true
        },
        {
          title: '行别',
          dataIndex: 'xingbie',
          sorter: true,
          scopedSlots: { customRender: 'xingbie' }
          // customRender: (text) => xingbieMap.get(text)
        },
        {
          title: '车站编号',
          dataIndex: 'stationId',
          sorter: true
        },
        {
          title: '车站名',
          dataIndex: 'stationName',
          sorter: true
        },
        {
          title: '股道数',
          dataIndex: 'trackNumber',
          sorter: true
        },
        {
          title: '拼音字头',
          dataIndex: 'shortName',
          sorter: false
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
        console.log(parameter)
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
  filters: {
    xingbieFilter (type) {
      console.log('xingbieFilter: ' + type)
      console.log('xingbieFilter: ' + xingbieMap.get(type))
      return xingbieMap.get(type)
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
            onChange: this.onSelectChange
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

    handleEdit (id) {
      this.$router.push({ name: 'LineEdit', params: { id: id } })
    },
    handleSub (record) {
      console.log('点击了删除: ' + record)
    },
    handleOk () {

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
