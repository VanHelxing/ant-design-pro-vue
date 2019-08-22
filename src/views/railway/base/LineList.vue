<template>
  <a-card :bordered="false">
    <router-view />
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'

export default {
  name: 'LineWrapper',
  components: {
    AInput,
    ATextarea
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {

  }
}
</script>
