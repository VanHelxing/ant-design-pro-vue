<template>
  <div>
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="铁路局"
        hasFeedback
        validateStatus="success"
      >
        <a-select v-decorator="['railwayBureauId', {rules: [{ required: true, message: '请选择铁路局' }], initialValue: '11'}]">
          <a-select-option :value="11">成都</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="路线编号"
        hasFeedback
        validateStatus="success"
      >
        <a-input
          placeholder="路线编号"
          v-decorator="[
            'lineId',
            {rules: [{ required: true, message: '请输入路线编号' }]}
          ]"
        ></a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="路线名称"
        hasFeedback
        validateStatus="success"
      >
        <a-input
          placeholder="路线名称"
          v-decorator="[
            'lineName',
            {rules: [{ required: true, message: '请输入路线名称' }]}
          ]"
        ></a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="备注"
        hasFeedback
        help="填写一段描述"
      >
        <a-textarea :rows="5" placeholder="..." v-decorator="['remark']" />
      </a-form-item>

      <a-form-item
        v-bind="buttonCol"
      >
        <a-row>
          <a-col span="6">
            <a-button type="primary" html-type="submit" @click="handleSubmit">提交</a-button>
          </a-col>
          <a-col span="10">
            <a-button @click="handleGoBack">返回</a-button>
          </a-col>
          <a-col span="8"></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { findById, save } from '@/api/railway/station'

export default {
  name: 'StationEdit',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      form: this.$form.createForm(this),
      params: {}
    }
  },
  mounted () {
    this.loadEditInfo(this.$route.params.id)
  },
  methods: {
    handleGoBack () {
      // TODO
      // 改为动态组件时应该把这个方法派发出去，交由父组件处理
      this.$router.back()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          this.params.railwayBureauId = values.railwayBureauId
          this.params.lineId = values.lineId
          this.params.lineName = values.lineName
          this.params.remark = values.remark

          save(this.params)
        }
      })
    },
    loadEditInfo (id) {
      const { form } = this

      if (!(id === 0)) {
        findById(id)
          .then(res => {
            return res.data
          })
          .then(res => {
            this.params.id = res.id
            this.params.version = res.version

            form.setFieldsValue({ railwayBureauId: res.railwayBureauId })
            form.setFieldsValue({ lineId: res.lineId })
            form.setFieldsValue({ lineName: res.lineName })
            form.setFieldsValue({ remark: res.remark })
          })
      } else {
        this.params.id = ''
      }
    }
  }
}
</script>
