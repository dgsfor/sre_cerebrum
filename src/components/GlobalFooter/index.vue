<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://github.com/gsgs-libin" target="_blank">@Dgsfor</a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/vueComponent" target="_blank">vueComponent</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
